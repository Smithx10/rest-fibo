var assert = require('assert-plus');
// var consul = require('consul'); // Want to demonstrate ontainerPilot instead of handling this all in the application.
var bunyan = require('bunyan');
var epimetheus = require('epimetheus');
var handler = require('restify-errors');
// var manta = require('manta'); // Place holder for Shipping logs to Manta (Object Storage)
var restify = require('restify');

epimetheus.instrument(server);

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
    serializers: restify.bunyan.serializers,
});

// Create Prototype
function fibo(opts) {
    this.log = opts.log.child({app_type: 'fibo-function'});
    this.log.info('Creating a Fibo');
};

// Get Fibonacci number from user input
fibo.prototype.getFibonacci = function getFibonacci(num){
    assert.number(num, 'num');
    this.log.info({user_input: num})

    var a = 1, b = 0, temp;

    while (num >= 0){
        temp = a;
        a = a + b;
        b = temp;
        num--;
    };

    this.log.debug({returned_value: b});
    return b;
};

log.info('starting');



// Create our fibo Object
var fibo = new fibo({log: log});

var log_restify = log.child({app_type: 'fibo-restify'});
// Create Restify Server
var server = restify.createServer({
    name: 'fibo-api',
    log: log_restify
});

// Define our Routes
server.pre(function (req, res, next) {
    req.log.info({req: req}, 'start');
    next();
});

server.get('/test', function (req, res, next) {
    req.log.info('url is "%s"', req.url);
    res.send({ test: 'test' });
    next();
});

// Handle getFibonacci
server.get('/getFibonacci/:num', getFibonacciResponse);

// Create a Simple Respond function
function getFibonacciResponse(req, res, next) {
    //  Log :num
    req.log.info('Request Param is "%s"', req.params.num);
    // Handle bad user input 
    if (isNaN(req.params.num)) {
       response = 'Please Specify a Number'; 
    } else {
        // Type Conversion
        req.params.num = parseInt(req.params.num);
        response = JSON.stringify(fibo.getFibonacci(req.params.num));
    };

    // Send Response.
    res.send(response);
  next();
};

server.on('after', function (req, res, route) {
    req.log.info({res: res}, "finished");
});
    // Start the http Server on the Desired Port
server.listen(8080, function () {
    console.log('ready on %s', server.url);
});

log.info('done');
