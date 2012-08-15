"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class;

var MyClass = new Class("MyClass", {
    Extends: require("./MySuperClass.class.js"),
    init: function () {
        this.Super().getInitCallOrder().MySuperClass = arguments;
    },
    _protectedMethod: function () {
        return "this is protected";
    }
});

module.exports = MyClass;