"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class,
    A = require("./A.class.js");

var C = new Class("C", {
    Extends: require("./B.class.js"),
    init: function () {
        A.initCallOrder.push("C");
        A.initArguments.push(Array.prototype.slice.call(arguments));
    },
    callSuper1: function (str) {
        return this.Super.callSuper1(str);
    },
    exposeThis: function () {
        return this;
    }
});

module.exports = C;