/* eslint-disable no-console, func-names, handle-callback-err */
'use strict';

var bytes = require('bytes');
var fs = require('fs');
var path = require('path');
var parallelize = require('../');

var file1 = __filename;
var file2 = path.resolve(__dirname + '/../package.json');

var next = parallelize(function displayResults(err, results) {
  if (err) { throw err; }

  // results in the order which the async fns were called
  console.log(file1 + ' size = %s', bytes(Buffer.byteLength(results[0])));
  console.log(file2 + ' size = %s', bytes(Buffer.byteLength(results[1])));
});

fs.readFile(file1, next());
fs.readFile(file2, next());

// Sample output:
//
// /home/username/projects/parallelize/example/basic.js size = 649B
// /home/username/projects/parallelize/package.json size = 1.11kB
