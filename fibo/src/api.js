'use strict';
var fibo = require('./fibo.js').fibo;
var assert =require('assert-plus');
var bunyan = require('bunyan');
var epimetheus = require('epimetheus');
var restify = require('restify');

// Set Log Path from EnvVar
var FIBO_LOGPATH = (process.env.FIBO_LOGPATH) ? process.env.FIBO_LOGPATH : '/var/log';

var log = bunyan.createLogger({
    name: 'fibo-api',
    streams: [
        {
            type: 'rotating-file',
            period: '1d',
            count: 7, 
            path: FIBO_LOGPATH + '/fibo-api.log'
        },
        {
            stream: process.stdout
        }
    ],
    serializers: restify.bunyan.serializers,
});

var log_restify = log.child({app_type: 'fibo-restify'});
// Create Restify Server
var server = restify.createServer({
    name: 'fibo-api',
    version: '1.0.0',
    log: log_restify
});

// Bind Some simple metrics
epimetheus.instrument(server);

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

//  Create Route getFibonacci  *Note, Restify supports Versioned Routes*
server.get('/getFibonacci/:num', getFibonacciResponse);

// Create a Simple Handler
function getFibonacciResponse(req, res, next) {
    //  Log :num
    req.log.info('Request Param is "%s"', req.params.num);

    if (Math.sign(req.params.num) === 1) {
        req.params.num = parseInt(req.params.num);
        fibo.getFibonacci(req.params.num, function getFibArray(err, data) {
            if (err) {
                throw err;
            } else {
                res.send(JSON.stringify(data));
            };
        });
    } else {
        res.send('Please use a Postiive Number');
    };

  next();
};

// log the response
server.on('after', function (req, res, route) {
    req.log.info({res: res}, "finished");
});

// Start the http Server on the Desired Port
server.listen(8080, function () {
    console.log('ready on %s', server.url);
});

