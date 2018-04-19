var assert = require('assert-plus');
var log = require('bunyan');
var restify = require('restify');

function fibonacci(num){

  var a = 1, b = 0, temp;

  while (num >= 0){
      temp = a;
      a = a + b;
      b = temp;
      num--;
    };

  return b;
};



