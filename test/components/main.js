/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
/* global window */
define([
  'angular',
  './about-test-component',
  './test-harness-component'
], function(angular) {

'use strict';

var module = angular.module('bedrock.messages-test', [
  'bedrock.authn', 'bedrock.authn-password', 'bedrock.form', 'bedrock.identity',
  'bedrock.meta'
]);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      title: 'Test Harness',
      template: '<br-test-harness></br-test-harness>'
    })
    .when('/about', {
      title: 'About',
      template: '<br-about-test></br-about-test>'
    })
    .when('/i/:identity', {
      title: 'Identity',
      template:
        '<br-identity-viewer br-identity="$resolve.identity">' +
        '</br-identity-viewer>',
      resolve: {
        identity: function($route, brIdentityService) {
          var identityBaseUri = window.data.identity.baseUri;
          var identity = $route.current.params.identity;
          return brIdentityService.collection
            .get(identityBaseUri + '/' + identity);
        }
      }
    });
});

});
