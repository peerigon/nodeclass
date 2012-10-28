"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class;

// D is missing the init-function
var D = new Class("D", {
    Extends: require("./E.class.js"),
    exposeDThis: function () {
        return this;
    }
});

module.exports = D;