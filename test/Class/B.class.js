"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class,
    expect = require("expect.js"),
    A = require("./A.class.js");

var B = new Class("B", {
    Extends: A,
    undefinedProp: undefined,
    nullProp: null,
    booleanProp: false,
    numberProp: 2,
    stringProp: "b",
    _undefinedProp: undefined,
    _nullProp: null,
    _booleanProp: false,
    _numberProp: 2,
    _stringProp: "b",
    __undefinedProp: undefined,
    __nullProp: null,
    __booleanProp: false,
    __numberProp: 2,
    __stringProp: "b",
    myStringB: "",
    init: function () {
        var C = require("./C.class.js");

        A.initCallOrder.push("B");
        A.initArguments.push(Array.prototype.slice.call(arguments));
        expect(this.Instance).to.be.a(C);
        expect(this.Instance.Class).to.be(C);
        expect(this.Super).to.be.a("function");
        this.Super(); // calling super with no arguments
        expect(this.Super).to.be.an(A);
    },
    getClassNames: function () {
        return "B " + this.Super.getClassNames();
    },
    _getClassNames: function () {
        return "B " + this.Super._getClassNames();
    },
    __getClassNames: function () {
        return "B";
    },
    _protectedMethodB: function () {

    },
    exposeBThis: function () {
        return this;
    }
});

module.exports = B;