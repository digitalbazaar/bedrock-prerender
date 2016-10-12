/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brAboutTest', {
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-prerender-test/about-test-component.html')
  });
}

/* @ngInject */
function Ctrl($document, $location, brMetaService) {
  var self = this;

  brMetaService.set([
    {
      property: 'og:description',
      content: 'About Page - Property'
    },
    {
      property: 'og:image',
      content: 'https://upload.wikimedia.org/wikipedia/' +
        'commons/a/a8/IFL_Small.jpg'
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
      content: 'About Page - Name'
    }
  ]);

  self.navigate = function(url) {
    $location.url(url);
  };
}

return register;

});
