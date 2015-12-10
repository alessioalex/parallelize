/* eslint-disable no-console, func-names, handle-callback-err */
'use strict';

var parallelize = require('../');

var next = parallelize(function(err, results) {
  if (err) { throw err; }

  console.log('\n------------ ALL DONE ------------ \n');
  // results in the order which the async fns were called
  console.log(results);
});

var callAsyncFn = function(fn, interval, args) {
  setTimeout(function() {
    // first arg of an async fn should be the err
    args.unshift(null);
    fn.apply(null, args);
  }, interval);
};

// call an async function after 300 miliseconds with 0 as the argument
callAsyncFn(next(), 300, [0]);
callAsyncFn(next(), 100, [1, 2]);
callAsyncFn(next(), 150, [3, 4]);

// Should output ->
/*
  ------------ ALL DONE ------------

  [ 0, [ 1, 2 ], [ 3, 4 ] ]
*/