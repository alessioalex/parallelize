"use strict";

var parallelize = require('../');

var next = parallelize(function(err, results) {
  if (err) { throw err; }

  console.log('\n------------ ALL DONE ------------ \n');
  // results in the order which the async fns were called
  console.log(results);
});

var callAsyncFn = function(fn, interval, args) {
  var interval = interval;

  setTimeout(function() {
    // first arg of an async fn should be the err
    args.unshift(null);
    fn.apply(null, args);
  }, interval);
};

callAsyncFn(next(function(err, result) {
  console.log('1st function called after 300 ms, result: %s', result);
}), 300, [0]);

callAsyncFn(next(function(err, result) {
  console.log('2nd function called after 100 ms, result: %s', result);
}), 100, [1, 2]);

callAsyncFn(next(function(err, result) {
  console.log('3rd function called after 150 ms, result: %s', result);
}), 150, [3, 4]);

// Should output ->
/*
  2nd function called after 100 ms, result: 1
  3rd function called after 150 ms, result: 3
  1st function called after 300 ms, result: 0

  ------------ ALL DONE ------------

  [ 0, [ 1, 2 ], [ 3, 4 ] ]
*/
