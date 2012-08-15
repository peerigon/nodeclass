"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class,
    A = require("./A.class.js");

var C = new Class("C", {
    Extends: require("./B.class.js"),
    init: function () {
        A.initCallOrder.push("C");
        A.initArguments.push(arguments);
    }
});

module.exports = C;