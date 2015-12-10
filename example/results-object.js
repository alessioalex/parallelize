/* eslint-disable no-console, func-names, handle-callback-err */
'use strict';

var parallelize = require('../');

var next = parallelize();

var callAsyncFn = function(fn, interval, args) {
  setTimeout(function() {
    // first arg of an async fn should be the err
    args.unshift(null);
    fn.apply(null, args);
  }, interval);
};

callAsyncFn(next('firstFn'), 300, [0]);
callAsyncFn(next('secondFn'), 100, [1, 2]);
callAsyncFn(next('thirdFn'), 150, [3, 4]);

next(function(err, results) {
  if (err) { throw err; }

  console.log('\n------------ ALL DONE ------------ \n');
  // results is an object this time
  console.log(results);
});

// Should output ->
/*
------------ ALL DONE ------------

[ secondFn: [ 1, 2 ], thirdFn: [ 3, 4 ], firstFn: 0 ]
*/
