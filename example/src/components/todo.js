'use strict';

var component = require('../../../index');
var templates = require('../templates');

module.exports = function (data) {
    this.template = templates['templates/todo.html'];
    component.call(this, data);
};
