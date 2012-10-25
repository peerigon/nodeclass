"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var A = new Class("A", {
    getClassName: function () {
        return "A";
    },
    _getClassName: function () {
        return "A";
    },
    __getClassName: function () {
        return "A";
    },
    exposeAThis: function () {
        return this;
    }
});

module.exports = A;