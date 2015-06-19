'use strict';

var sliced = require('sliced');

function parallelize(finalCb) {
  var results;
  var counter = 0;
  var called = false;

  var finalCallback = finalCb || function noop() {};

  // this function has the role of increasing the counter
  // so that we know how many parallel functions there are
  // this wrapper function should be executed right away, not in some setTimeout
  return function wrapCallback(index) {
    var fnIndex;

    // used to aggregate the results in the order the functions were called,
    // not their callbacks
    // results can be an array or an object
    if (typeof index === 'string') {
      fnIndex = index;

      if (!results) { results = {}; }
    } else {
      fnIndex = counter;

      if (!results) { results = []; }
    }

    counter++;

    // this will aggregate the results and call your original callback functions
    // in case there's an error it will return right away
    return function parallelCb(err) {
      // aggregate (in order) whatever is after the error argument
      var args = sliced(arguments, 1);
      // `null` when no args are returned
      if (!args.length) { args[0] = null; }
      // when there are multiple arguments push an array with the fn results,
      // otherwise push the single argument
      results[fnIndex] = (args.length <= 1) ? args[0] : args;

      if (err) {
        called = true;
        return finalCallback(err);
      } else if (!called && !--counter) {
        finalCallback(null, results);
      }
    };
  };
}

module.exports = parallelize;
