"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    is = require("metaclass").helpers.is,
    detectConstructor = require("../lib/classes/PropertyNameDetection.class.js").detectConstructor,
    buildMetaConstructor = require("../lib/metaBuilders/buildMetaConstructor.js"),
    Method = require("metaclass").Method,
    Visibility = require("metaclass").Visibility,
    checkError = require("./testHelpers/checkError.js");

describe("buildMetaConstructor", function () {
    var checkForTypeError = checkError(TypeError);

    function test(key, value) {
        return buildMetaConstructor(key, value, is(value), detectConstructor(key, value));
    }

    it("should return an instance of Method", function () {
        var result = test("construct", function () {});

        expect(is(result).instanceOf(Method)).to.be(true);
    });
    it("should apply the constructor's name", function () {
        function constructor() {}

        expect(test("construct", constructor).getName()).to.be("construct");
        expect(test("_construct", constructor).getName()).to.be("construct");
        expect(test("__construct", constructor).getName()).to.be("construct");
        expect(test("init", constructor).getName()).to.be("init");
        expect(test("_init", constructor).getName()).to.be("init");
        expect(test("__init", constructor).getName()).to.be("init");
        expect(test("initialize", constructor).getName()).to.be("initialize");
        expect(test("_initialize", constructor).getName()).to.be("initialize");
        expect(test("__initialize", constructor).getName()).to.be("initialize");
    });
    it("should apply the constructor's visibility", function () {
        function constructor() {}

        expect(test("construct", constructor).getVisibility()).to.be(Visibility.PUBLIC);
        expect(test("_construct", constructor).getVisibility()).to.be(Visibility.PROTECTED);
        expect(test("__construct", constructor).getVisibility()).to.be(Visibility.PRIVATE);
        expect(test("init", constructor).getVisibility()).to.be(Visibility.PUBLIC);
        expect(test("_init", constructor).getVisibility()).to.be(Visibility.PROTECTED);
        expect(test("__init", constructor).getVisibility()).to.be(Visibility.PRIVATE);
        expect(test("initialize", constructor).getVisibility()).to.be(Visibility.PUBLIC);
        expect(test("_initialize", constructor).getVisibility()).to.be(Visibility.PROTECTED);
        expect(test("__initialize", constructor).getVisibility()).to.be(Visibility.PRIVATE);
    });
    it("should throw an exception when the value is no function", function () {
        expect(function () {
            test("construct", undefined);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", null);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", true);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", 2);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", "Hello");
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", []);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", {});
        }).to.throwException(checkForTypeError);
    });
    it("should throw an exception when the value is a native constructor function", function () {
        expect(function () {
            test("construct", Boolean);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", Number);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", String);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", Array);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", Object);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", RegExp);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", Function);
        }).to.throwException(checkForTypeError);
        expect(function () {
            test("construct", Date);
        }).to.throwException(checkForTypeError);
    });
});
