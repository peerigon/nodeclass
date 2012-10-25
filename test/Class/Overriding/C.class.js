"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var C = new Class("C", {
    Extends: require("./B.class.js"),
    getClassName: function () {
        return "C " + this.Super.getClassName();
    },
    _getClassName: function () {
        return "C " + this.Super._getClassName();
    },
    __getClassName: function () {
        return "C";
    },
    exposeCThis: function () {
        return this;
    }
});

module.exports = C;