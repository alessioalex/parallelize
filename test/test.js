var test = require('tape');
var parallelize = require('../');
var noop = function(){};

var callFn = function(fn, args) {
  setImmediate(function() {
    fn.apply(null, args);
  });
};

test('it should invoke the callback', function(t) {
  var next = parallelize(t.end);

  setImmediate(next(noop));
  setImmediate(next(noop));
});

test('it should aggregate the results properly', function(t) {
  var next = parallelize(function(err, results) {
    t.equal(null, err);
    t.deepEqual([1, 2, 3, 4], results);
    t.end();
  });

  callFn(next(noop), [null, 1, 2]);
  callFn(next(noop), [null, 3, 4]);
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
