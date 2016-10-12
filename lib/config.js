/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;

config.prerender = {};

config.prerender.phantomJs = {};
// The arguments that will be passed on the PhantomJS command line.
config.prerender.phantomJs.args = {
  '--load-images': false,
  '--ignore-ssl-errors': true,
  '--ssl-protocol': 'tlsv1.2'
};

// Prerending is enabled only on defined routes.
// An optional route specific `cacheTtl` (sec) may be specified.
config.prerender.routes = {
  // '/about': {cacheTtl: 10000},
  // '/i/*': {}
};

// Blacklist a single url path or multiple url paths. Compares using regex,
// so be specific when possible. If a blacklist is supplied, all url's will
// be prerendered except ones containing a blacklist path. Value may be a
// single string or an array of strings. (e.g. '/about')
config.prerender.blacklist = null;

// maximum time (ms) to wait for pages to fully load
config.prerender.maxWaitForPage = 15000;

config.prerender.cache = {};
// Default TTL (sec) for URLs added to cache
config.prerender.cache.ttl = 300;
