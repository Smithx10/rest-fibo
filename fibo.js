var assert = require('assert-plus');
var restify = require('restify');
var handler = require('restify-errors');
var bunyan = require('bunyan');

var server = restify.createServer();

var log = bunyan.createLogger({
    name: 'fibo',
    streams: [
        {
            type: 'rotating-file',
            period: '1d',
            count: 7, 
            path: '/home/smith/fibo.log'
        },
        {
            stream: process.stdout
        }
    ]
});

// Create Prototype
function fibo(opts) {
    this.log = opts.log.child({app_type: 'fibo'});
    this.log.info('Creating a Fibo');
};

// Get Fibonacci number from user input
fibo.prototype.getFibonacci = function getFibonacci(num){
    assert.number(num, 'num');
    this.log.info({input: num})

    var a = 1, b = 0, temp;

    while (num >= 0){
        temp = a;
        a = a + b;
        b = temp;
        num--;
    };

    return b;
};

log.info('start');

// Create our fibo Object
var fibo = new fibo({log: log});

// Create the http server
var server = restify.createServer();

// Define our Routes
server.get('/', function (req, res, next) {
   res.send({ hello: 'world' });
   next();
});

server.get('/getFibonacci/:num', getFibonacciRespond);


// Create a Simple Respond function
function getFibonacciRespond(req, res, next) {
    var response;
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


    // Start the http Server on the Desired Port
server.listen(8080, function () {
    console.log('ready on %s', server.url);
});

log.info('done');
