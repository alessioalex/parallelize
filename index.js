"use strict";

function parallelize(finalCallback) {
  var results = [];
  var counter = 0;
  var called = false;

  finalCallback = finalCallback || function noop() {};

  // this fn has the role of increasing the counter
  // so that we know how many parallel functions there are
  // this wrapper function should be executed right away, not in some setTimeout
  return function wrapCallback(fn) {
    var that = this;

    counter++;

    // this will aggregate the results and call your original callback functions
    // in case there's an error it will return right away
    return function parallelCb(err) {
      fn.apply(that, arguments);

      // aggregate whatever is after the error argument
      Array.prototype.push.apply(results, Array.prototype.slice.call(arguments, 1));

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
