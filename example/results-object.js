/* eslint-disable no-console, func-names, handle-callback-err */
'use strict';

var bytes = require('bytes');
var fs = require('fs');
var path = require('path');
var parallelize = require('../');

var file1 = __filename;
var file2 = path.resolve(__dirname + '/../package.json');

var next = parallelize();

fs.readFile(file1, next('file1'));
fs.readFile(file2, next('file2'));

next(function displayResults(err, results) {
  if (err) { throw err; }

  // access results by specified properties instead of by index
  console.log(file1 + ' size = %s', bytes(Buffer.byteLength(results.file1)));
  console.log(file2 + ' size = %s', bytes(Buffer.byteLength(results.file2)));
});

// Sample output:
//
// /home/username/projects/parallelize/example/basic.js size = 649B
// /home/username/projects/parallelize/package.json size = 1.11kB
