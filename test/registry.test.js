"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    registry = require("../lib/node/registry.js");

describe("registry", function () {
    var descrA = {},
        descrB = {},
        descrC = {},
        constrA = function A() {},
        constrB = function B() {},
        constrC = function C() {},
        srcA = "A",
        srcB = "B",
        srcC = "C";

    describe(".setEntry()", function () {
        it("should throw no error", function () {
            registry.setEntry(descrA, constrA, srcA);
            registry.setEntry(descrB, constrB, srcB);
            registry.setEntry(descrC, constrC, srcC);
        });
    });
    describe(".getEntry()", function () {
        it("should return the requested entry", function () {
            var entry,
                expectedEntry;

            expectedEntry = {
                descriptor: descrA,
                constructor: constrA,
                compiledSrc: srcA
            };
            entry = registry.getEntry(descrA);
            expect(entry).to.eql(expectedEntry);
            entry = registry.getEntry(constrA);
            expect(entry).to.eql(expectedEntry);

            expectedEntry = {
                descriptor: descrB,
                constructor: constrB,
                compiledSrc: srcB
            };
            entry = registry.getEntry(descrB);
            expect(entry).to.eql(expectedEntry);
            entry = registry.getEntry(constrB);
            expect(entry).to.eql(expectedEntry);

            expectedEntry = {
                descriptor: descrC,
                constructor: constrC,
                compiledSrc: srcC
            };
            entry = registry.getEntry(descrC);
            expect(entry).to.eql(expectedEntry);
            entry = registry.getEntry(constrC);
            expect(entry).to.eql(expectedEntry);
        });
        it("should return null if the component is unknown", function () {
            expect(registry.getEntry(function D() {})).to.be(null);
            expect(registry.getEntry({})).to.be(null);
        });
    });
});