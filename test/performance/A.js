"use strict"; // run code in ES5 strict mode

var util = require("util");

function A() {
    var key,
        value,
        proto;

    if (A.withBinding) {
        proto = A.prototype;
        for (key in proto) {
            if (proto.hasOwnProperty(key)) {
                value = proto[key];
                if (typeof value === "function") {
                    this[key] = value.bind(this);
                }
            }
        }
    }
}

A.prototype.booleanProp = false;
A.prototype._booleanProp = false;
A.prototype.__booleanProp = false;
A.prototype.myStringB = "";

A.prototype._protectedMethod = function _protectedMethod() {};
A.prototype.setBooleanProp = function (value) {
    this.booleanProp = value;
    return this;
};
A.prototype.getBooleanProp = function () {
    return this.booleanProp;
};
A.prototype.setMyStringB = function (value) {
    this.myStringB = value;
    return this;
};
A.prototype.getMyStringB = function () {
    return this.myStringB;
};
A.prototype.getClassNames = function () {
    return "A";
};

module.exports = A;