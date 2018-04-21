'use strict';

var test = require('tape');
var fibo = require('./fibo').fibo;
var clients = require('restify-clients');
var server = require('./api.js').server;
var assert = require('assert-plus');

var client = clients.createStringClient({
    url: 'http://localhost:8080'
});

var errorString = 'The Value provided is not a Positive Number.'

test('getFibonacci(4): Positive Number' , function(t) {
    fibo.getFibonacci(4, function(err, data) {
        var actual = data;
        var expected = [1,1,2,3,5];
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


test('/getFibonacci/4: Positive Number', function(t) {
    client.get('/getFibonacci/4', function(err, req, res, data) {
        var actual = data;
        var expected = '[1,1,2,3,5]';
        t.equal(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});

test('/getFibonacci/-4: Negative Number"', function(t) {
    client.get('/getFibonacci/-4', function(err, req, res, data) {
        var actual = data;
        var expected = errorString;
        t.equal(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});

test('/getFibonacci/bob: String"', function(t) {
    client.get('/getFibonacci/bob', function(err, req, res, data) {
        var actual = data;
        var expected = errorString;
        t.equal(actual, expected);
        console.log(actual, expected);
    });
    t.end();
});


