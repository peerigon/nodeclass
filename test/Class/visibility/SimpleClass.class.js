"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var SimpleClass = new Class("SimpleClass", {
    $undefinedProp: undefined,
    $nullProp: null,
    $numberProp: 2,
    $stringProp: "hello",
    $arrProp: [],
    $objProp: {},
    $staticMethod: function () {},
    $_staticMethod: function () {}, // this won't be protected because there are no static protected methods
    $__staticMethod: function () {}, // this won't be private because there are no static private methods
    undefinedProp: undefined,
    nullProp: null,
    numberProp: 2,
    stringProp: "hello",
    _undefinedProp: undefined,
    _nullProp: null,
    _numberProp: 2,
    _stringProp: "hello",
    __undefinedProp: undefined,
    __nullProp: null,
    __numberProp: 2,
    __stringProp: "hello",
    publicMethod: function () {},
    _protectedMethod: function () {},
    __privateMethod: function () {}
});

module.exports = SimpleClass;