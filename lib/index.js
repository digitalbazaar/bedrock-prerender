/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
/* global webpage, window, document */
var bedrock = require('bedrock');
var cache = require('bedrock-redis');
var config = bedrock.config;
var express = require('bedrock-express').express;
var phridge = require('phridge');
var prerender = require('prerender-node');
var querystring = require('querystring');
var url = require('url');

require('bedrock-requirejs');
require('bedrock-views');

var api = {};
module.exports = api;

require('./config');

var logger = bedrock.loggers.get('app');
var phantom = null;
var requestQueue = {};

bedrock.events.on('bedrock.start', callback => {
  // configure blacklist
  if(config.prerender.blacklist) {
    prerender.blacklisted(config.prerender.blacklist);
  }
  phridge.spawn(config.prerender.phantomJs.args).then(p => {
    phantom = p;
  }).then(() => callback(), callback);
});

bedrock.events.on('bedrock-express.configure.routes', (app, callback) => {
  var routes = config.prerender.routes;
  var routeKeys = Object.keys(config.prerender.routes);
  if(routeKeys.length) {
    var router = express.Router();
    var error;
    var success = routeKeys.every(route => {
      if(typeof routes[route] !== 'object') {
        error = new TypeError(
          'Route options must be an object. Route: \'' + route +
          '\' Value: \'' + routes[route] + '\'');
        return false;
      }
      router.get(route, _prerender);
      return true;
    });
    if(!success) {
      return callback(error);
    }
    app.use(router);
  }
  callback();
});

function _prerender(req, res, next) {
  if(!prerender.shouldShowPrerenderedPage(req)) {
    return next('route');
  }
  var parsedUrl = url.parse(req.originalUrl);
  var query = querystring.parse(parsedUrl.query);
  delete query['_escaped_fragment_'];
  var renderUrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: parsedUrl.pathname,
    query: query
  });
  cache.client.get(renderUrl, (err, data) => {
    // Note: ignore error from cache
    if(!err && data) {
      return res.end(data);
    }
    var promise;
    if(requestQueue[renderUrl]) {
      promise = new Promise((resolve, reject) => {
        requestQueue[renderUrl].then(resolve, reject);
      });
    } else {
      var options = config.prerender.routes[req.route.path];
      promise = _render(renderUrl, options);
    }
    promise.then(data => res.end(data), () => res.sendStatus(404));
  });
}

// TODO: For non-Angular pages, we may want to track resources
// requested/received with the PhantomJS onResource* events as a way of
// determining when the page is fully rendered.
function _render(renderUrl, options) {
  var cacheTtl = options.cacheTtl || config.prerender.cache.ttl;

  // NOTE: phantom.run is not compatible with arrow functions
  return phantom.run(
    renderUrl, config.prerender, function(renderUrl, config, resolve) {
      var cancel;
      var ready = false;
      var page = webpage.create();

      page.clearMemoryCache();

      page.onCallback = function() {
        if(ready) {
          return;
        }
        clearTimeout(cancel);
        resolve(page.content);
        page.close();
      };

      page.onInitialized = function() {
        page.evaluate(function() {
          document.addEventListener('DOMContentLoaded', function() {
            require(['bedrock-angular'], function(b) {
              if(typeof b.render === 'function') {
                b.render().then(function() {
                  window.callPhantom();
                });
              }
            });
          }, false);
        });
        cancel = setTimeout(function() {
          ready = true;
          resolve(page.content);
          page.close();
        }, config.maxWaitForPage);
      };

      page.open(renderUrl, function() {
        // do nothing
      });
    }).then(result => {
      return new Promise((resolve, reject) => {
        cache.client.setex(renderUrl, cacheTtl, result, err => {
          if(err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }).then(res => {
      delete requestQueue[renderUrl];
      return res;
    }).catch(err => {
      delete requestQueue[renderUrl];
      logger.error('bedrock-prerender:', err);
      throw err;
    });
}
