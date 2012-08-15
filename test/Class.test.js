"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    Class = require("../lib/node/Class.js"),
    registry = require("../lib/node/registry.js"),
    _ = require("underscore");

describe("Class (node only)", function () {
    it("should add a new entry to the registry", function () {
        var SimpleClass = require("./Class/Visibility/SimpleClass.class.js");

        expect(registry.getEntry(SimpleClass).constructor).to.be(SimpleClass);
    });
});