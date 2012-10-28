"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class,
    expect = require("expect.js");

var A = new Class("A", {
    $initCallOrder: [],
    $initArguments: [],
    $staticMethod: function () {},
    $_staticMethod: function () {}, // this won't be protected because there are no static protected methods
    $__staticMethod: function () {}, // this won't be private because there are no static private methods
    $exposeStaticThis: function () {
        return this;
    },
    myStringA: "",
    init: function () {
        var C = require("./C.class.js");

        A.initCallOrder.push("A");
        A.initArguments.push(Array.prototype.slice.call(arguments));
        expect(this.Instance).to.be.a(C);
        expect(this.Instance.Class).to.be(C);
        expect(this.Super).to.be(undefined);
    },
    getClassNames: function () {
        return "A";
    },
    _getClassNames: function () {
        return "A";
    },
    __getClassNames: function () {
        return "A";
    },
    _protectedMethodA: function () {

    },
    exposeAThis: function () {
        return this;
    }
});

module.exports = A;