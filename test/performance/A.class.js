"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class;

var A = new Class("A", {
    $staticMethod: function () {},
    $_staticMethod: function () {},
    $__staticMethod: function () {},
    myStringA: "",
    init: function () {

    },
    getClassNames: function () {
        return "A";
    },
    _protectedMethodA: function () {

    }
});

module.exports = A;