"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    Class = require("../lib/node/Class.js"),
    registry = require("../lib/node/registry.js"),
    _ = require("underscore");

describe("Class (node only)", function () {
    it("should add a new entry to the registry", function () {
        var C = require("./Class/C.class.js");

        expect(registry.getEntry(C).constructorFunc).to.be(C);
    });
    describe("Naming", function () {
        it("should throw an error when a class uses illegal characters", function () {
            expect(function () {
                var IllegalCharClass = require("./Class/IllegalCharClass.class.js");
            }).to.throwException();
        });
    });
    describe("Presets", function () {
        it("should throw an error with non-primitive instance attributes", function () {
            expect(function () {
                var NonPrimitivePresets = require("./Class/NonPrimitivePresets.class.js");
            }).to.throwException();
        });
    });
});