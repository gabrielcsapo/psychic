'use strict';

function router() {

    var routes = [];
    var unknown;

	/*
		@define: intializes the router class
		@requires: "func": {
			type: function,
			parameters: function(route),
			define: "this is used for when a hash is not found"
		}
		@example:
		var router = require('./router')
        router.intitialize(function(route) {
			console.log(route + 'not found');
		});
	*/
    var intitialize = function(func) {
        unknown = func;
        window.onhashchange = hashchange;
        hashchange();
    };

	/*
		@define: is called when a hash change occurs
		@requires: none
		@returns: none
	*/
    var hashchange = function() {
        var hash = window.location.hash.replace('#', '');
        if (routes[hash]) {
            routes[hash]();
        } else {
            unknown(hash);
        }
    };

	/*
		@define: binds hash events to global window.routes
		@requires: "hash": {type: String}
		@requires: "func": {type: Function}
		@example:
		var router = require('./router');
		router.bind('hello', function() {
			alert('hellow world');
		});
	*/
    var bind = function(hash, func) {
        if (typeof func === 'function') {
            routes[hash] = func;
        } else {
            throw new TypeError('func needs to be a function');
        }
    };

	/*
		@define: changes the hash of the window object
		@requires: "hash": {type: String}
		@example:
		var router = require('./router');
		router.change('hello');
	*/
    var change = function(hash) {
		/*
			This could happen if the user is already on a hash event
			and restarts the app
		 */
        if (location.href.substring(location.href.indexOf('#')) === '#' + hash) {
            hashchange();
        } else {
            location.href = '#' + hash;
        }
    };

    return {
        bind: bind,
        change: change,
        routes: routes,
        intitialize: intitialize
    };

}

// make sure that we are making this a singleton
var instance;
module.exports = instance = instance || router();
