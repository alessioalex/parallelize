"use strict";

var parallelize = require('../');

var next = parallelize(function(err, results) {
  if (err) { throw err; }

  console.log('\n------------ ALL DONE ------------ \n');
  console.log(results);
});

var someAsyncFn = function(fn) {
  var interval = Math.floor(Math.random() * 10) * 100 + 500;

  setTimeout(function() {
    fn(null, interval);
  }, interval);
};

for (var i = 1; i <= 3; i++) {
  (function(i) {
    someAsyncFn(next(function(err, result) {
      console.log('fn %s returned -> err: %s, result: %s', i, err, result);
    }));
  }(i));
}
