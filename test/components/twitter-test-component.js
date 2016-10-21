/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brTwitterTest', {
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-prerender-test/twitter-test-component.html')
  });
}

/* @ngInject */
function Ctrl($document, $location, brMetaService) {
  var self = this;

  brMetaService.set([
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:description',
      content: 'Twitter Test Summary Card'
    },
    {
      name: 'twitter:image',
      content: 'https://upload.wikimedia.org/wikipedia/' +
        'commons/a/a8/IFL_Small.jpg'
    },
    {
      name: 'twitter:title',
      content: $document[0].title
    },
    {
      name: 'twitter:url',
      content: $location.absUrl()
    }
  ]);

  self.navigate = function(url) {
    $location.url(url);
  };
}

return register;

});
