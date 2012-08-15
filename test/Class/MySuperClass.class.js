"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class;

module.exports = new Class("MySuperClass", {
    Extends: require("./MyAbstractClass.class.js"),
    undefinedProp: undefined,
    nullProp: null,
    numberProp: 2,
    stringProp: "hello",
    arrProp: [],
    objProp: {},
    _undefinedProp: undefined,
    _nullProp: null,
    _numberProp: 2,
    _stringProp: "hello",
    _arrProp: [],
    _objProp: {},
    initCallOrder: {},
    init: function () {
        this.initCallOrder.MySuperClass = arguments;
    },
    // implemented abstract "?sayHello" of MyAbstractClass
    sayHello: function () {

    }
});