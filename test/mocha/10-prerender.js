/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var async = require('async');
var bedrock = require('bedrock');
var config = bedrock.config;
var helpers = require('./helpers');
var mockData = require('../mock.data');
var request = require('request');

request = request.defaults({
  strictSSL: false
});

describe('bedrock-prerender', () => {
  beforeEach(done => {
    helpers.clearCache(config.server.baseUri, done);
  });
  describe('requests with proper headers', () => {
    it('should render an angular component to html', done => {
      async.auto({
        get: callback => {
          var identityUrl =
          mockData.identities.alpha.identity.id + '?_escaped_fragment_=';
          request.get(
            identityUrl, {
              headers: {
                Accept: 'text/html',
                'User-Agent': 'facebot'
              }
            }, (err, res, body) => callback(err, body));
        },
        test: ['get', (callback, results) => {
          var label = mockData.identities.alpha.identity.label;
          results.get.should.contain(label);
          callback();
        }]
      }, done);
    });
    it('sets cache TTL to 1 second and makes 500 requests', function(done) {
      this.timeout(90000);
      var originalTtl = config.prerender.cache.ttl;
      config.prerender.cache.ttl = 1;
      async.timesSeries(500, (n, next) => {
        async.auto({
          get: callback => {
            var identityUrl =
            mockData.identities.alpha.identity.id + '?_escaped_fragment_=';
            request.get(
              identityUrl, {
                headers: {
                  Accept: 'text/html',
                  'User-Agent': 'facebot'
                }
              }, (err, res, body) => callback(err, body));
          },
          test: ['get', (callback, results) => {
            var label = mockData.identities.alpha.identity.label;
            results.get.should.contain(label);
            callback();
          }]
        }, next);
      }, err => {
        config.prerender.cache.ttl = originalTtl;
        done(err);
      });
    });
  }); // end proper headers
  describe('requests with improper headers', () => {
    it('does not render page with missing user-agent header', done => {
      async.auto({
        get: callback => {
          var identityUrl =
          mockData.identities.alpha.identity.id + '?_escaped_fragment_=';
          request.get(
            identityUrl, {
              headers: {Accept: 'text/html'}
            }, (err, res, body) => callback(err, body));
        },
        test: ['get', (callback, results) => {
          var label = mockData.identities.alpha.identity.label;
          results.get.should.not.contain(label);
          // the html should not be rendered in this case
          results.get.should.contain('<br-app></br-app>');
          callback();
        }]
      }, done);
    });
  }); // end improper headers
});
