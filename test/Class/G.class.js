"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class,
    H = require("./H.class.js"),
    expect = require("expect.js");

var G = new Class("G", {
    Extends: H,
    init: function () {
        var F = require("./F.class.js");

        this.someMethod();  // calling overridden method of F within the constructor
        H.initCallOrder.push("G");
        H.initArguments.push(Array.prototype.slice.call(arguments));
        expect(this.Instance).to.be.a(F);
        expect(this.Instance.Class).to.be(F);
        expect(this.Super).to.be.a("function");
        this.Super();   // we're not passing the arguments here
        expect(this.Super).to.be.a(H);
    },
    someMethod: function () {
        // this will be overridden
    }
});

module.exports = G;