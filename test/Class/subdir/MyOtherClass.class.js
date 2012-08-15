"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class,
    MyClass = require("../MyClass.class.js");

var MyOtherClass = new Class("MyOtherClass", {
    Extends: MyClass,
    init: function () {
        this.Super().initCallOrder.push("MyOtherClass");
    },
    $someStatic: true,
    __privateMethod: function () {
        throw new Error("You can't call me");
    }
});

module.exports = MyOtherClass;