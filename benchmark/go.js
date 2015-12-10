/* eslint-disable no-console, func-names, handle-callback-err */
'use strict';

var cpus = require('os').cpus().length;
var parallelize = require('../');
var async = require('async');
var neoAsync = require('neo-async');
var fastParallel = require('fastparallel')();
var runParallel = require('run-parallel');

var asyncFn = function demo2(arg, cb) {
  setImmediate(function() { cb(); });
};

suite('parallelize alternatives', function() {
  set('iterations', 100000);
  set('mintime', 4000);
  set('concurrency', cpus);

  bench('neo-async.parallel', function(done) {
    var callAsyncFn = function(cb) { asyncFn(1, cb); };

    neoAsync.parallel([callAsyncFn, callAsyncFn, callAsyncFn], done);
  });

  bench('fastparallel', function(done) {
    fastParallel({}, [asyncFn, asyncFn, asyncFn], 1, done);
  });

  bench('parallelize', function(done) {
    var next = parallelize(done);

    asyncFn(1, next());
    asyncFn(1, next());
    asyncFn(1, next());
  });

  bench('run-parallel', function(done) {
    var callAsyncFn = function(cb) { asyncFn(1, cb); };

    runParallel([callAsyncFn, callAsyncFn, callAsyncFn], done);
  });

  bench('async.parallel', function(done) {
    var callAsyncFn = function(cb) { asyncFn(1, cb); };

    async.parallel([callAsyncFn, callAsyncFn, callAsyncFn], done);
  });
});
