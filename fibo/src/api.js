'use strict';
var fibo = require('./fibo.js').fibo;
var assert =require('assert-plus');
var bunyan = require('bunyan');
var epimetheus = require('epimetheus');
var restify = require('restify');
var handler = require('restify-errors');

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
    req.log.debug({req: req}, 'start');
    next();
});

server.get('/test', function (req, res, next) {
    req.log.debug('url is "%s"', req.url);
    res.send({ test: 'test' });
    next();
});

//  Create Route getFibonacci  *Note, Restify supports Versioned Routes*
server.get('/api/fibo/:num', getFibonacciResponse);

// Create a Simple Handler
function getFibonacciResponse(req, res, next) {
    //  Log :num
    req.log.debug('Request Param is "%s"', req.params.num);
    fibo.getFibonacci(req.params.num, function getFibArray(err, data) {
        if (err) {
            res.send(new handler.InvalidArgumentError(err.message));
            return next();
        } 
        
        res.send(JSON.stringify(data));
        next();
    });
};

// log the response
server.on('after', function (req, res, route) {
    req.log.debug({res: res}, "finished");
});

// Start the http Server on the Desired Port
server.listen(8080, function () {
    log_restify.info('ready on %s', server.url);
});

module.exports = {
    server: server
}

