# bedrock-prerender

[![Build Status](http://ci.digitalbazaar.com/buildStatus/icon?job=bedrock-prerender&build=42)](http://ci.digitalbazaar.com/job/bedrock-prerender/42/)

This is a [bedrock][]-based library that provides a PhantomJS rendering engine
that can be used to render HTML from AngularJS pages. This allows bots that do
not execute Javascript on pages to parse and index pages properly.

The site **must** be minified/optimized for the rending engine to function
properly.

Pages connected with defined routes are rendered to HTML the first time they
are requested and added to a Redis cache. Subsequent requests for the same
route will be served directly from the Redis cache until the specified time
to live (TTL) has expired. Only bot request containing a `User-Agent` header
in the list of defined [crawlerUserAgents][] will be rendered. All other
requests will be handled normally.

## Quick Examples
```
var config = require('bedrock').config;

// Default TTL (sec) for all URLs added to cache
config.prerender.cache.ttl = 10000; // default: 300

// Prerending is enabled only on defined routes.
// An optional route specific `cacheTtl` (sec) may be specified.
config.prerender.routes = {
  '/about': {cacheTtl: 10000},
  '/i/*': {}
};
```

### Simulate a bot request for testing
```
curl -k -A twitterbot https://bedrock.dev:18443/about
```

[bedrock]: https://github.com/digitalbazaar/bedrock
[crawlerUserAgents]: https://github.com/prerender/prerender-node/blob/master/index.js#L37
