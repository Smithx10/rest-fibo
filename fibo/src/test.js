'use strict';

var test = require('tape');
var fibo = require('./fibo').fibo;
var clients = require('restify-clients');
var server = require('./api.js').server;
var assert = require('assert-plus');

var client = clients.createStringClient({
    url: 'http://localhost:8080'
});

var errorAPIString = 'InvalidArgumentError: The Parameter provided is not a Positive Number.';

var errorString = 'The Parameter provided is not a Positive Number.'; 

test('getFibonacci(4): Positive Number' , function(t) {
    fibo.getFibonacci(4, function(err, data) {
        var actual = data;
        var expected = [0,1,1,2,3];
        t.deepEqual(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});

test('getFibonacci(-4): Negative Number"', function(t) {
    fibo.getFibonacci(-4, function(err, data) {
        var actual = err.message; 
        var expected = errorString;
        t.equal(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});

test('getFibonacci("bob"): String"', function(t) {
    fibo.getFibonacci('bob', function(err, data) {
        var actual = err.message; 
        var expected = errorString;
        t.equal(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});


test('/api/fibo/4: Positive Number', function(t) {
    client.get('/api/fibo/4', function(err, req, res, data) {
        var actual = data;
        var expected = '[0,1,1,2,3]';
        t.equal(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});

test('/api/fibo/-4: Negative Number"', function(t) {
    client.get('/api/fibo/-4', function(err, req, res, data) {
        var actual = data;
        var expected = errorAPIString;
        t.equal(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});

test('/api/fibo/bob: String"', function(t) {
    client.get('/api/fibo/bob', function(err, req, res, data) {
        var actual = data;
        var expected = errorAPIString;
        t.equal(actual, expected);
        console.log(actual, expected);
        server.close();
    });
    t.end();
});


