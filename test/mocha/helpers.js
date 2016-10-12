/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var async = require('async');
var cache = require('bedrock-redis');

var api = {};
module.exports = api;

api.clearCache = function(prefix, callback) {
  cache.client.keys(prefix + '*', (err, rows) => {
    if(err) {
      return callback(err);
    }
    async.each(rows, (r, callback) => cache.client.del(r, callback), callback);
  });
};
