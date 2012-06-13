"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    isNodeClassConstructor = require("../lib/helpers/isNodeClassConstructor.js");

describe("isNodeClassConstructor", function () {
    it("should return true if the flag obj is present and the nodeClass attribute is true", function () {
        var subject = function () {};

        subject["@"] = {nodeClass: true};
        expect(isNodeClassConstructor(subject)).to.be(true);
    });
    it("should return false if the subject is not a function", function () {
        expect(isNodeClassConstructor(undefined)).to.be(false);
        expect(isNodeClassConstructor(null)).to.be(false);
        expect(isNodeClassConstructor(0)).to.be(false);
        expect(isNodeClassConstructor([])).to.be(false);
        expect(isNodeClassConstructor({})).to.be(false);
    });
    it("should return false if the flag obj is not present", function () {
        var subject = function () {};

        expect(isNodeClassConstructor(subject)).to.be(false);
    });
    it("should return false if the nodeClass attribute is not present", function () {
        var subject = function () {};

        subject["@"] = {};
        expect(isNodeClassConstructor(subject)).to.be(false);
    });
    it("should return false if the nodeClase attribute is false", function () {
        var subject = function () {};

        subject["@"] = {nodeClass: false};
        expect(isNodeClassConstructor(subject)).to.be(false);
    });
});
