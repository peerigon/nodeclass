"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

module.exports = new Class({
    Extends: require("./MySuperClass.class.js"),
    initCalled: false,
    init: function () {
        this.initCalled = true;
    },
    isInitCalled: function () {
        return this.initCalled && this.Super.isInitCalled();
    },
    sayHello: function () {
        console.log("hello");
    },
    _protectedMethod: function () {
        return "this is protected";
    }
});