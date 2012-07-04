"use strict"; // run code in ES5 strict mode

var Class = require("../../../../lib/index.js").Class;

module.exports = new Class({
    Extends: require("../MyClass.class.js"),
    isInitCalled: function () {
        return this.Super.isInitCalled();
    },
    $someStatic: true,
    __privateMethod: function () {
        throw new Error("You can't call me");
    },
    returnProtected: function () {
        return this.Super._protectedMethod();
    }
});