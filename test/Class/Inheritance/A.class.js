"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var A = new Class("A", {
    Extends: require("../Visibility/SimpleClass.class.js"),
    $initCallOrder: [],
    $initArguments: [],
    init: function () {
        A.initCallOrder.push("A");
        A.initArguments.push(arguments);
    }
});

module.exports = A;