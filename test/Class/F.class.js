"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class,
    G = require("./G.class.js"),
    H = require("./H.class.js"),
    expect = require("expect.js");

var F = new Class("F", {
    Extends: G,
    init: function () {
        H.initCallOrder.push("F");
        H.initArguments.push(Array.prototype.slice.call(arguments));
        expect(this.Instance).to.be.a(F);
        expect(this.Instance.Class).to.be(F);
        expect(this.Super).to.be.a("function");
    },
    someMethod: function () {
        expect(this.Super).to.be.a(G);
    }
});

module.exports = F;