/*eslint-disable no-console, func-names, handle-callback-err */
'use strict';

var parallelize = require('../');
var noop = function() {};

var next = parallelize(function(err, results) {
  if (err) { throw err; }

  console.log(results);
});

var someAsyncFn = function(fn) {
  var interval = Math.floor(Math.random() * 10) * 100 + 500;

  setTimeout(function() {
    var err = new Error('oups');
    fn(err, interval);
  }, interval);
};

for (var i = 1; i <= 3; i++) {
  someAsyncFn(next(noop));
}
