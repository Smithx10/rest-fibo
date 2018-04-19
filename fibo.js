var assert = require('assert-plus');
var restify = require('restify');
var bunyan = require('bunyan');
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


function fibo(opts) {
    this.log = opts.log.child({app_type: 'fibo'});
    this.log.info('Creating a Fibo');
};


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
var fibo = new fibo({log: log});

console.log(fibo.getFibonacci(5));
log.info('done');





