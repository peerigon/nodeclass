"use strict"; // run code in ES5 strict mode

var util = require("util"),
    B = require("./B.js");

function C() {}
util.inherits(C, B);

C.prototype.booleanProp = false;
C.prototype._booleanProp = false;
C.prototype.__booleanProp = false;
C.prototype.greeting = "";

C.prototype._protectedMethod = function _protectedMethod() {};
C.prototype.setBooleanProp = function (value) {
    this.booleanProp = value;
    return this;
};
C.prototype.getBooleanProp = function () {
    return this.booleanProp;
};
C.prototype.setGreeting = function () {
    this.greeting = "hello says the setter";
};

C.prototype.getGreeting = function () {
    return this.greeting + ", hello says the getter";
};
C.prototype.getClassNames = function () {
    return "C " + C.super_.prototype.getClassNames.call(this);
};

module.exports = C;