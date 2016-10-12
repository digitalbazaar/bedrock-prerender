/*
 * Copyright (c) 2015-2016 Digital Bazaar, Inc. All rights reserved.
 */

'use strict';
var bedrock = require('bedrock');
var config = bedrock.config;
var helpers = require('./helpers');

var mock = {};
module.exports = mock;

var userName = '';
mock.identities = {};

userName = 'alpha';
mock.identities[userName] = {};
mock.identities[userName].identity = helpers.createIdentity({
  userName: userName,
  label: '9584f421-534d-439c-bc82-2018c5d2db68'
});
mock.identities[userName].identity.sysResourceRole = [{
  sysRole: 'bedrock-test.identity.registered',
  generateResource: 'id'
}];

Object.keys(mock.identities).forEach(function(key) {
  var i = mock.identities[key];
  config['identity-http'].identities.push(i.identity);
  if(i.keys) {
    Array.prototype.push.apply(config.key.keys, [].concat(i.keys));
  }
});
