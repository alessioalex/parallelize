# parallelize

control flow library for parallel async functions; it invokes the callback with the aggregated results or an error

[![Build Status](https://travis-ci.org/alessioalex/parallelize.svg)](https://travis-ci.org/alessioalex/parallelize)

# example

Specify callback to run after all functions have completed at the end:

```js
var parallelize = require('parallelize');

var next = parallelize();

fs.readFile(file1, next());
fs.readFile(file2, next());

next(function displayResults(err, results) {
  if (err) { throw err; }

  // `results` array with data in the order which the async fns were called
  console.log(file1 + ' contents', results[0]);
  console.log(file2 + ' contents', results[1]);
});
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
