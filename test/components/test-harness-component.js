/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brTestHarness', {
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-prerender-test/test-harness-component.html')
  });
}

/* @ngInject */
function Ctrl(
  $document, $http, $location, $window, brAuthnService, brMetaService) {
  var self = this;
  self.showLogin = false;
  self.testData = null;
  self.authenticated = false;

  brMetaService.set([
    {
      property: 'og:description',
      content: 'The test homepage - Property'
    },
    {
      property: 'og:image',
      content: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/' +
        'Lion_06584.jpg/360px-Lion_06584.jpg'
    },
    {
      property: 'og:title',
      content: $document[0].title
    },
    {
      property: 'og:url',
      content: $location.absUrl()
    },
    {
      name: 'og:description',
      content: 'The test homepage - Name'
    }
  ]);

  self.authentication = {
    displayOrder: brAuthnService.displayOrder,
    methods: brAuthnService.methods
  };

  self.onLogin = function() {
    self.authenticated = true;
  };

  self.addIdentity = function(userName) {
    return $http.post('/createidentity', createIdentity(userName))
      .then(function(response) {
        self.testData = response.data.identity;
      });
  };

  self.navigate = function(url) {
    $location.url(url);
  };

  function createIdentity(userName) {
    var newIdentity = {
      sysSlug: userName,
      email: userName + '@bedrock.dev',
      sysPassword: 'password',
      sysResourceRole: [{
        sysRole: 'bedrock-test.identity.registered',
        generateResource: 'id'
      }]
    };
    return newIdentity;
  }
}

return register;

});
