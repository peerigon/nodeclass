"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class;

var C = new Class("C", {
    Extends: require("./B.class.js"),
    booleanProp: false,
    _booleanProp: false,
    __booleanProp: false,
    greeting: "",
    getClassNames: function () {
        return "C " + this.Super.getClassNames();
    },
    _protectedMethod: function () {},
    __privateMethod: function () {},
    setGreeting: function () {
        this.greeting = "hello says the setter";
    },
    getGreeting: function () {
        return this.greeting + ", hello says the getter";
    }
});

module.exports = C;