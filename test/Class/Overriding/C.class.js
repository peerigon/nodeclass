"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var C = new Class("C", {
    Extends: require("./B.class.js"),
    getClassNames: function () {
        return "C " + this.Super.getClassNames();
    },
    _getClassNames: function () {
        return "C " + this.Super._getClassNames();
    },
    __getClassNames: function () {
        return "C";
    },
    exposeCThis: function () {
        return this;
    }
});

module.exports = C;