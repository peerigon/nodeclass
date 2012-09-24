"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var NotImplemented = new Class("NotImplemented", {
    Extends: require("./A.class.js")
});

module.exports = NotImplemented;