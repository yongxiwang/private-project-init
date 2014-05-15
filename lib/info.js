'use strict';

var colors = require('colors');

exports.log = function(msg) {
    console.log(msg);
};

exports.error = function(e) {
    console.error(String('Error: ' + (e.message || e)).red);
};

exports.fatal = function(e) {
    console.error(String('Fatal error: ' + (e.message || e)).red);
    process.exit(1);
};