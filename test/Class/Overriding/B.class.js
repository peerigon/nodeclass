"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var B = new Class("B", {
    Extends: require("./A.class.js"),
    getClassName: function () {
        return "B " + this.Super.getClassName();
    },
    _getClassName: function () {
        return "B " + this.Super._getClassName();
    },
    __getClassName: function () {
        return "B";
    },
    exposeBThis: function () {
        return this;
    }
});

module.exports = B;