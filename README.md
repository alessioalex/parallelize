# parallelize

control flow library for parallel async functions; it invokes the callback with the aggregated results or an error

                                         888 888          888 d8b                   
                                         888 888          888 Y8P                   
                                         888 888          888                       
      88888b.   8888b.  888d888  8888b.  888 888  .d88b.  888 888 88888888  .d88b.  
      888 "88b     "88b 888P"       "88b 888 888 d8P  Y8b 888 888    d88P  d8P  Y8b 
      888  888 .d888888 888     .d888888 888 888 88888888 888 888   d88P   88888888 
      888 d88P 888  888 888     888  888 888 888 Y8b.     888 888  d88P    Y8b.     
      88888P"  "Y888888 888     "Y888888 888 888  "Y8888  888 888 88888888  "Y8888  
      888                                                                           
      888                                                                           
      888   

# example

```js
var parallelize = require('../index');

// this will fire once all functions are done
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
    // wrapping the callbacks with next (the fn returned by parallelize)
    someAsyncFn(next(function(err, result) {
      console.log('fn %s returned -> err: %s, result: %s', i, err, result);
    }));
  }(i));
}
```

# motivation

I wanted something similar to [after](http://npm.im/after) that aggregates results.
Note that I did not want to pass an array of functions like [async](http://npm.im/async) does.
There might be other libraries with similar approaches in the NPM registry, but nevertheless it was fun to create this one.

# how it works

The function returned by the module should wrap all your callbacks. It has two roles:

- increase the internal parallel functions counter (to know how many functions there are)
- replaces your callbacks with a custom callback that decreases the counter until it reaches 0 or there's an error

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
