var expect = require('chai').expect;
var assert = require('chai').assert;
var mocha = require('mocha');

describe('router', function() {
    
    var triggers = {};
    var router;
    var funcFired = 0;
    var func = function() {
        funcFired = 1;
    }
    var unknownTriggered = 0;
    var unknownRoute = "";
    var unknown = function(hash) {
        unknownTriggered = 1;
        unknownRoute = hash;
    }

    it('should intitialize and create route.routes as an array', function() {
        router = require('../router')
        router.intitialize(unknown);
        assert.isArray(router.routes);
    });

    it('should bind a hash to route.routes', function() {
        router.bind('home', func);
        assert.isFunction(router.routes['home']);
    });

    it('should trigger func', function(done) {
        this.timeout(30000);
        router.change('home');
        setTimeout(function () {
            assert.equal(funcFired, 1);
            funcFired = 0;
            done();
        }, 1);
    });

    it('should still trigger func after being called once already', function(done) {
        this.timeout(30000);
        router.change('home');
        setTimeout(function () {
            assert.equal(funcFired, 1);
            done();
        }, 1);
    })

    it('should throw an error that bind function is not a function', function() {
        try {
            router.bind('home', 'nope');
        } catch(ex) {
            assert.equal(ex.toString(), new TypeError('func needs to be a function').toString());
        }
    });

    it('should trigger window.location to be the value of the hash and call func', function() {
        router.change('home');
        assert.equal(window.location.hash.replace('#', ''), 'home');
    });

    it('should be triggered when hash is not in router', function(done) {
        this.timeout(30000);
        router.change('this-is-not-there');
        setTimeout(function () {
            assert.equal(unknownRoute, 'this-is-not-there');
            assert.equal(unknownTriggered, 1);
            done();
        }, 1);
    });

    it('should call unkonwn', function(done) {
        var router = require('../router')
        router.intitialize(function(hash) {
            if (hash == 'hello') {
                done();
            }
        });
        router.change('hello')
    });

    it('should call route after navigating away', function(done) {
        triggers.baseTriggeredAmount = 0;
        router.bind('#', function() {
            triggers.baseTriggered = 1;
            triggers.baseTriggeredAmount += 1;
        });
        router.bind('#foo', function() {
            triggers.otherTriggered = 1;
        });
        router.change('#');
        setTimeout(function () {
            router.change('#foo');
            setTimeout(function () {
                router.change('#');
                setTimeout(function () {
                    if(triggers.baseTriggeredAmount == 2) {
                        done();
                    }
                }, .1);
            }, .1)
        }, .1)
    });

});
