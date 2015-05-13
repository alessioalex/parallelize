var test = require('tape');
var parallelize = require('../');
var noop = function(){};
var immediate = (typeof setImmediate !== 'undefined') ? setImmediate : function(fn) {
  setTimeout(fn, 0);
};

var callFn = function(fn, args, timeout) {
  setTimeout(function() {
    fn.apply(null, args);
  }, timeout || 1);
};

test('it should invoke the "final" callback', function(t) {
  var next = parallelize(t.end);

  immediate(next(noop));
  immediate(next(noop));
});

test('it should not require callbacks', function(t) {
  var next = parallelize(t.end);

  immediate(next());
  immediate(next());
});

test('it should aggregate the results in the correct order', function(t) {
  var next = parallelize(function(err, results) {
    t.equal(null, err);
    t.deepEqual([[1, 2], [3, 4]], results);
    t.end();
  });

  callFn(next(noop), [null, 1, 2], 200);
  callFn(next(noop), [null, 3, 4], 100);
});

test('it should know to put an item instead of an array of results', function(t) {
  var next = parallelize(function(err, results) {
    t.equal(null, err);
    t.deepEqual([1, [3, 4]], results);
    t.end();
  });

  callFn(next(noop), [null, 1], 200);
  callFn(next(noop), [null, 3, 4], 100);
});

test('it should return an error', function(t) {
  var error = new Error('my err');

  var next = parallelize(function(err, results) {
    t.equal(error, err);
    t.end();
  });

  callFn(next(noop), [null, 1, 2]);
  callFn(next(noop), [error]);
  callFn(next(noop), [null, 3, 4]);
});
