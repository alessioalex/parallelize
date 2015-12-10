'use strict';

var sliced = require('sliced');
var noop = function noop() {};

function parallelize(finalCb) {
  var results;
  var counter = 0;
  var called = false;

  // backwords compatible with 2.x (specify finalCb at init instead of last fn)
  var finalCallback = finalCb || noop;

  // this function has the role of increasing the counter
  // so that we know how many parallel functions there are
  // this wrapper function should be executed right away, not in some setTimeout
  return function wrapCallback(index) {
    var fnIndex;
    var typeofIndex = typeof index;

    // used to aggregate the results in the order the functions were called,
    // not their callbacks
    // results can be an array or an object
    if (typeofIndex === 'string') {
      fnIndex = index;

      if (!results) { results = {}; }
    } else if (finalCallback === noop && typeofIndex === 'function') {
      // last function is 'final' one: `next(finalCb)`
      counter--;
      finalCallback = index;
    } else {
      // called with no arg for example
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
