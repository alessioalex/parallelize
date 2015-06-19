# parallelize

control flow library for parallel async functions; it invokes the callback with the aggregated results or an error

[![Build Status](https://travis-ci.org/alessioalex/parallelize.svg)](https://travis-ci.org/alessioalex/parallelize)

# example

```js
var parallelize = require('parallelize');

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

callAsyncFn(next(), 300, [0]);
callAsyncFn(next(), 100, [1, 2]);
callAsyncFn(next(), 150, [3, 4]);

// Or (since the callbacks are optional):
/*
callAsyncFn(next(), 300, [0]);
callAsyncFn(next(), 100, [1, 2]);
callAsyncFn(next(), 150, [3, 4]);
*/
```

should output:

```
  2nd function called after 100 ms, result: 1
  3rd function called after 150 ms, result: 3
  1st function called after 300 ms, result: 0

  ------------ ALL DONE ------------

  [ 0, [ 1, 2 ], [ 3, 4 ] ]
```

If you'd prefer to have a results object instead of an array check the `results-object.js` example for more details.

# motivation

I wanted something similar to [after](http://npm.im/after) that aggregates results.
Note that I did not want to pass an array of functions like [async](http://npm.im/async) does.
There might be other libraries with similar approaches in the NPM registry, but nevertheless it was fun to create this one.

# how it works

The function returned by the module should wrap all your callbacks. It has two roles:

- increase the internal parallel functions counter (to know how many functions there are)
- replaces your callbacks with a custom callback that decreases the counter until it reaches 0 or there's an error
- remembers the results of the async callbacks into order; if the callback is invoked with multiple arguments it puts those into an array

# install

With [npm](http://npmjs.org) do:

```
npm install parallelize
```

# test

With [npm](http://npmjs.org) do:

```
npm test
```

# license

[MIT](http://alessioalex.mit-license.org/)
