/* eslint-disable func-names */
'use strict';

var test = require('tape');
var parallelize = require('../');
var immediate = (typeof setImmediate !== 'undefined') ? setImmediate : function(fn) {
  setTimeout(fn, 0);
};

var callFn = function(callback, args, timeout) {
  // callback after <timeout> miliseconds / 1
  setTimeout(function() {
    callback.apply(null, args);
  }, timeout || 1);
};

test('it should invoke the callback', function(t) {
  t.plan(2);

  var next = parallelize(function() { t.pass('v2 api'); });

  immediate(next());
  immediate(next());

  var next3 = parallelize();

  immediate(next3());
  immediate(next3());

  next3(function() { t.pass('v3 api'); });
});

test('it should aggregate the results in the correct order', function(t) {
  t.plan(6);

  var next = parallelize(function(err, results) {
    t.equal(null, err);
    t.deepEqual([[1, 2], [3, 4]], results);
    t.pass('v2 api');
  });

  callFn(next(), [null, 1, 2], 100);
  callFn(next(), [null, 3, 4], 1);

  var next3 = parallelize();

  callFn(next3(), [null, 1, 2], 100);
  callFn(next3(), [null, 3, 4], 1);

  next3(function(err, results) {
    t.equal(null, err);
    t.deepEqual([[1, 2], [3, 4]], results);
    t.pass('v3 api');
    t.end();
  });
});

test('it should return an object instead of an array', function(t) {
  t.plan(6);

  var next = parallelize(function(err, results) {
    t.equal(null, err);
    t.deepEqual({
      first: [1, 2],
      second: [3, 4]
    }, results);
    t.pass('v2 api');
  });

  callFn(next('first'), [null, 1, 2], 100);
  callFn(next('second'), [null, 3, 4], 1);

  var next3 = parallelize();

  callFn(next3('first'), [null, 1, 2], 100);
  callFn(next3('second'), [null, 3, 4], 1);

  next3(function(err, results) {
    t.equal(null, err);
    t.deepEqual({
      first: [1, 2],
      second: [3, 4]
    }, results);
    t.pass('v3 api');
  });
});

test('it should know to put an item instead of an array of results', function(t) {
  t.plan(6);

  var next = parallelize(function(err, results) {
    t.equal(null, err);
    t.deepEqual([1, [3, 4]], results);
    t.pass('v2 api');
  });

  callFn(next(), [null, 1], 100);
  callFn(next(), [null, 3, 4], 1);

  var next3 = parallelize();

  callFn(next3(), [null, 1], 100);
  callFn(next3(), [null, 3, 4], 1);

  next3(function(err, results) {
    t.equal(null, err);
    t.deepEqual([1, [3, 4]], results);
    t.pass('v3 api');
  });
});

test('it should return an error', function(t) {
  t.plan(4);

  var error = new Error('my err');

  var next = parallelize(function(err) {
    t.equal(error, err);
    t.pass('v2 api');
  });

  callFn(next(), [null, 1, 2]);
  callFn(next(), [error]);
  callFn(next(), [null, 3, 4]);

  var next3 = parallelize();

  callFn(next3(), [null, 1, 2]);
  callFn(next3(), [error]);
  callFn(next3(), [null, 3, 4]);

  next3(function(err) {
    t.equal(error, err);
    t.pass('v3 api');
  });
});

test('it should work with one function', function(t) {
  var next = parallelize();
  t.plan(1);

  callFn(next(), [1]);
  next(function() {
    t.ok(1);
  });
});

test('it should work with no function', function(t) {
  var next = parallelize();
  t.plan(1);

  next(function() {
    t.ok(1);
  });
});

