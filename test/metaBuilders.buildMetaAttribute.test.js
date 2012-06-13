"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    is = require("metaclass").helpers.is,
    detect = require("../lib/classes/PropertyDetection.class.js").detect,
    buildMetaAttribute = require("../lib/metaBuilders/buildMetaAttribute.js"),
    ClassError = require("../lib/classes/ClassError.class.js"),
    Attribute = require("metaclass").Attribute,
    Visibility = require("metaclass").Visibility,
    checkError = require("./testHelpers/checkError.js");

describe("buildMetaAttribute", function () {
    var checkForClassError = checkError(ClassError),
        metaAttribute;

    function test(key, value) {
        return buildMetaAttribute(key, value, is(value), detect(key, value));
    }

    it("should return an instance of Attribute", function () {
        expect(is(test("myAttribute", "hello")).instanceOf(Attribute)).to.be(true);
    });
    it("should throw an exception if the attribute is abstract", function () {
        expect(function () {
            test("?myAttribute", "hello");
        }).to.throwException(checkForClassError);
    });
    it("should throw an exception if the attribute is static and not public", function () {
        expect(function () {
            test("$_myAttribute", "hello");
        }).to.throwException(checkForClassError);
        expect(function () {
            test("$__myAttribute", "hello");
        }).to.throwException(checkForClassError);
    });
    it("should return the clean attribute name", function () {
        metaAttribute = test("$myAttribute", "hello");
        expect(metaAttribute.getName()).to.be("myAttribute");
    });
    it("should set the visibility appropriately", function () {
        metaAttribute = test("myAttribute", "hello");
        expect(metaAttribute.getVisibility()).to.be(Visibility.PUBLIC);
        metaAttribute = test("$myAttribute", "hello");
        expect(metaAttribute.getVisibility()).to.be(Visibility.PUBLIC);
        metaAttribute = test("_myAttribute", "hello");
        expect(metaAttribute.getVisibility()).to.be(Visibility.PROTECTED);
        metaAttribute = test("__myAttribute", "hello");
        expect(metaAttribute.getVisibility()).to.be(Visibility.PRIVATE);
    });
    it("should set the static-ness appropriately", function () {
        metaAttribute = test("myAttribute", "hello");
        expect(metaAttribute.getStatic()).to.be(false);
        metaAttribute = test("$myAttribute", "hello");
        expect(metaAttribute.getStatic()).to.be(true);
    });
    it("should set the type and initial value appropriately", function () {
        var array = [1, 2, 3],
            object = {"user": "john doe"};

        metaAttribute = test("myAttribute", undefined);
        expect(metaAttribute.getType()).to.be(undefined);
        expect(metaAttribute.getInitialValue()).to.be(null);
        metaAttribute = test("myAttribute", null);
        expect(metaAttribute.getType()).to.be(undefined);
        expect(metaAttribute.getInitialValue()).to.be(null);
        metaAttribute = test("myAttribute", true);
        expect(metaAttribute.getType()).to.be(Boolean);
        expect(metaAttribute.getInitialValue()).to.be(true);
        metaAttribute = test("myAttribute", Boolean);
        expect(metaAttribute.getType()).to.be(Boolean);
        expect(metaAttribute.getInitialValue()).to.be(null);
        metaAttribute = test("myAttribute", 2);
        expect(metaAttribute.getType()).to.be(Number);
        expect(metaAttribute.getInitialValue()).to.be(2);
        metaAttribute = test("myAttribute", Number);
        expect(metaAttribute.getType()).to.be(Number);
        expect(metaAttribute.getInitialValue()).to.be(null);
        metaAttribute = test("myAttribute", "hello");
        expect(metaAttribute.getType()).to.be(String);
        expect(metaAttribute.getInitialValue()).to.be("hello");
        metaAttribute = test("myAttribute", String);
        expect(metaAttribute.getType()).to.be(String);
        expect(metaAttribute.getInitialValue()).to.be(null);
        metaAttribute = test("myAttribute", array);
        expect(metaAttribute.getType()).to.be(Array);
        expect(metaAttribute.getInitialValue()).to.be(array);
        metaAttribute = test("myAttribute", Array);
        expect(metaAttribute.getType()).to.be(Array);
        expect(metaAttribute.getInitialValue()).to.be(null);
        metaAttribute = test("myAttribute", object);
        expect(metaAttribute.getType()).to.be(Object);
        expect(metaAttribute.getInitialValue()).to.be(object);
        metaAttribute = test("myAttribute", Object);
        expect(metaAttribute.getType()).to.be(Object);
        expect(metaAttribute.getInitialValue()).to.be(null);
    });
});
