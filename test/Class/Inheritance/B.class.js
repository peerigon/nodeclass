"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class,
    A = require("./A.class.js");

var B = new Class("B", {
    Extends: A,
    init: function () {
        A.initCallOrder.push("B");
        A.initArguments.push(arguments);
    }
});

module.exports = B;