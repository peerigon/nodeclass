"use strict";

var expect = require("expect.js"),
    isPublic = require("isPublic.js");

describe("isPublic", function () {

    var returnValue,
        publicChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$",
        nonFunctionProperties = [false, 1, "abc", [], {}];

    it("should return true with any Function-property starting with an allowed character except _", function () {

        var currentChar,
            i;

        for (i = 0; i < publicChars.length; i++) {
            currentChar = publicChars[i];
            returnValue = isPublic(currentChar, Function);
            expect(returnValue).to.be(true);
        }

    });

    it("should return false with any Function-property starting with _", function () {

        returnValue = isPublic("_", Function);
        expect(returnValue).to.be(false);

    });

    it("should return false with any non-Function-property", function () {

        var currentChar,
            currentProp,
            i,
            j;

        for (i = 0; i < publicChars.length; i++) {
            currentChar = publicChars[i];
            for (j = 0; j < nonFunctionProperties.length; j++) {
                currentProp = nonFunctionProperties[j];
                returnValue = isPublic(currentChar, currentProp);
                expect(returnValue).to.be(false);
            }
        }

    });

});