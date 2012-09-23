"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var B = new Class("B", {
    Extends: require("./A.class.js"),
    implementThis: function () {
        return "hello from Class B";
    }
});

module.exports = B;