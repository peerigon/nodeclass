"use strict"; // run code in ES5 strict mode

var util = require("util"),
    A = require("./A.js");

function B() {}
util.inherits(B, A);

B.prototype.booleanProp = false;
B.prototype._booleanProp = false;
B.prototype.__booleanProp = false;
B.prototype.myStringB = "";

B.prototype._protectedMethod = function _protectedMethod() {};
B.prototype.setBooleanProp = function (value) {
    this.booleanProp = value;
    return this;
};
B.prototype.getBooleanProp = function () {
    return this.booleanProp;
};
B.prototype.setMyStringB = function (value) {
    this.myStringB = value;
    return this;
};
B.prototype.getMyStringB = function () {
    return this.myStringB;
};
B.prototype.getClassNames = function () {
    return "B " + B.super_.prototype.getClassNames.call(this);
};

module.exports = B;