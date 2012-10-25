"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var A = new Class("A", {
    getClassNames: function () {
        return "A";
    },
    _getClassNames: function () {
        return "A";
    },
    __getClassNames: function () {
        return "A";
    },
    exposeAThis: function () {
        return this;
    }
});

module.exports = A;