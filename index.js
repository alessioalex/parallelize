"use strict";

function parallelize(finalCallback) {
  var results;
  var counter = 0;
  var called = false;

  finalCallback = finalCallback || function noop() {};

  // this fn has the role of increasing the counter
  // so that we know how many parallel functions there are
  // this wrapper function should be executed right away, not in some setTimeout
  return function wrapCallback(fn) {
    var fnIndex;
    var fnType = typeof fn;
    var that = this;

    // used to aggregate the results in the order the functions were called,
    // not their callbacks
    // results can be an array or an object
    if (fnType === 'string') {
      fnIndex = fn;

      if (!results) { results = {}; }
    } else {
      fnIndex = counter;

      if (!results) { results = []; }
    }

    counter++;

    // this will aggregate the results and call your original callback functions
    // in case there's an error it will return right away
    return function parallelCb(err) {
      // callback is optional
      if (fnType === 'function') { fn.apply(that, arguments); }

      // aggregate (in order) whatever is after the error argument
      var args = Array.prototype.slice.call(arguments, 1);
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
    }
  };
};

module.exports = parallelize;
