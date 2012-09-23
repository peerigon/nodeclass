"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class,
    A = require("./A.class.js");

var B = new Class("B", {
    Extends: A,
    _protectedProperty: 2,
    __privateProperty: 2,
    init: function () {
        A.initCallOrder.push("B");
        A.initArguments.push(Array.prototype.slice.call(arguments));
        this.Super();
    },
    callSuper2: function (str) {
        return this.Super.callSuper1(str);
    },
    _protectedMethod: function () {

    },
    __privateMethod: function () {

    }
});

module.exports = B;