'use strict';
var assert = require('assert-plus');
var bunyan = require('bunyan');
// var manta = require('manta'); // Place holder for Shipping logs to Manta (Object Storage)
// var consul = require('consul'); // Want to demonstrate ontainerPilot instead of handling this all in the application.

// Set Log Path from EnvVar
var FIBO_LOGPATH = (process.env.FIBO_LOGPATH) ? process.env.FIBO_LOGPATH : '/var/log';

var log = bunyan.createLogger({
    name: 'fibo',
    streams: [
        {
            type: 'rotating-file',
            period: '1d',
            count: 7,
            level: 'debug',
            path: FIBO_LOGPATH + '/fibo.log'
        },
        {
            stream: process.stdout
        }
    ],
});

// Create Prototype
function fibo(opts) {
    this.log = opts.log.child({app_type: 'fibo-function'});
    this.log.debug('Creating a Fibo');
};

// Get Fibonacci number from user input
fibo.prototype.getFibonacci = function getFibonacci(num, callback){
    
    assert.func(callback, 'callback');

    this.log.info('Processing: %d', num )
    // This handles the missing number assertion.  I prefer to not change types up front and handle everything here, for now. arrgghhh.
    if (Math.sign(num) != 1) {
        callback(new Error('The Parameter provided is not a Positive Number.'));
        return;
    }

    this.log.debug({user_input: num})
    var resultsArray = [];
    var a = 0, b = 1, temp;

    while (num >= 0){
        temp = a;
        a = a + b;
        b = temp;
        resultsArray.push(b);
        
        num--;
    };

    this.log.debug({returned_value: b});
    callback(null, resultsArray);
};

// Create our fibo Object
var fibo = new fibo({log: log});

module.exports = {
    fibo: fibo
};
