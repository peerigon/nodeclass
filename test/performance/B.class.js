"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class,
    A = require("./A.class.js");

var B = new Class("B", {
    Extends: A,
    booleanProp: false,
    _booleanProp: false,
    __booleanProp: false,
    myStringB: "",
    init: function () {
        this.Super(); // calling super with no arguments
    },
    getClassNames: function () {
        return "B " + this.Super.getClassNames();
    },
    _protectedMethodB: function () {

    }
});

module.exports = B;