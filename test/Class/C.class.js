"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class,
    expect = require("expect.js"),
    A = require("./A.class.js");

var C = new Class("C", {
    Extends: require("./B.class.js"),
    $nullProp: null,
    $booleanProp: false,
    $numberProp: 1,
    $stringProp: "c",
    $arrProp: [],
    $objProp: {},
    undefinedProp: undefined,
    nullProp: null,
    booleanProp: false,
    numberProp: 1,
    stringProp: "c",
    _undefinedProp: undefined,
    _nullProp: null,
    _booleanProp: false,
    _numberProp: 1,
    _stringProp: "c",
    __undefinedProp: undefined,
    __nullProp: null,
    __booleanProp: false,
    __numberProp: 1,
    __stringProp: "c",
    greeting: "",
    init: function () {
        A.initCallOrder.push("C");
        A.initArguments.push(Array.prototype.slice.call(arguments));
        expect(this.Instance).to.be.a(C);
        expect(this.Instance.Class).to.be(C);
        expect(this.Super).to.be.a("function");
    },
    getClassNames: function () {
        return "C " + this.Super.getClassNames();
    },
    _getClassNames: function () {
        return "C " + this.Super._getClassNames();
    },
    __getClassNames: function () {
        return "C";
    },
    setGreeting: function () {
        this.greeting = "hello says the setter";
    },
    getGreeting: function () {
        return this.greeting + ", hello says the getter";
    },
    exposeCThis: function () {
        return this;
    }
});

module.exports = C;