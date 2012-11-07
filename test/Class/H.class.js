"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class,
    expect = require("expect.js");

var H = new Class("H", {
    $initCallOrder: [],
    $initArguments: [],
    init: function () {
        H.initCallOrder.push("H");
        H.initArguments.push(Array.prototype.slice.call(arguments));
    }
});

module.exports = H;