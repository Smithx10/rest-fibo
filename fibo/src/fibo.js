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
    this.log.info('Creating a Fibo');
};

// Get Fibonacci number from user input
fibo.prototype.getFibonacci = function getFibonacci(num, callback){
    assert.number(num, 'num');
    assert.func(callback, 'callback');

    if (Math.sign(num) != 1) {
        callback(new Error('Please Provide a Positive Number.'));
        return;
    }

    this.log.info({user_input: num})
    var resultsArray = [];
    var a = 1, b = 0, temp;

    while (num >= 0){
        temp = a;
        a = a + b;
        b = temp;
        resultsArray.push(b);
        
        num--;
    };

    this.log.info({returned_value: b});
    callback(null, resultsArray);
};

// Create our fibo Object
var fibo = new fibo({log: log});

module.exports = {
    fibo: fibo
}
