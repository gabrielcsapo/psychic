'use strict';

var component = require('../../../index');
var templates = require('../templates');

module.exports = function (data) {
    this.template = templates['templates/main.html'];
    component.call(this, data);
};
