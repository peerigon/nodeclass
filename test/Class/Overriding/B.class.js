"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var B = new Class("B", {
    Extends: require("./A.class.js"),
    getClassNames: function () {
        return "B " + this.Super.getClassNames();
    },
    _getClassNames: function () {
        return "B " + this.Super._getClassNames();
    },
    __getClassNames: function () {
        return "B";
    },
    exposeBThis: function () {
        return this;
    }
});

module.exports = B;