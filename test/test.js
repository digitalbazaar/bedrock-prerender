/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var brIdentity = require('bedrock-identity');
var util = require('util');
require('bedrock-authn-password');
require('bedrock-identity-http');
require('bedrock-mongodb');
require('bedrock-prerender');
require('./mock.data');

require('./app.config');

bedrock.events.on('bedrock-express.configure.routes', app => {
  app.post('/createidentity', (req, res) => {
    var identity = {};
    identity['@context'] = bedrock.config.constants.IDENTITY_CONTEXT_V1_URL;
    identity.id = createIdentityId(req.body.sysSlug);
    identity.type = 'Identity';
    identity.sysSlug = req.body.sysSlug;
    identity.sysResourceRole = req.body.sysResourceRole;
    identity.sysPassword = req.body.sysPassword;
    identity.sysStatus = 'active';
    brIdentity.insert(null, identity, (err, result) => {
      res.status(201).json(result);
    });
  });
});

function createIdentityId(name) {
  return util.format('%s%s/%s',
    bedrock.config.server.baseUri,
    bedrock.config['identity-http'].basePath,
    encodeURIComponent(name));
}

require('bedrock-test');
bedrock.start();
