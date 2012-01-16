"use strict";

var Class = require("../lib/Class.class");

var SuperClass = new Class({
    superProperty: function () {}
});

var TestClass = new Class({
    Extends: SuperClass,
    someFunction: function () {}
});
var myTestClass = new TestClass();

console.log(myTestClass instanceof SuperClass);