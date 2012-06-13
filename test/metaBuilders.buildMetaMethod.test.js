"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    is = require("metaclass").helpers.is,
    detect = require("../lib/classes/PropertyDetection.class.js").detect,
    buildMetaMethod = require("../lib/metaBuilders/buildMetaMethod.js"),
    ClassError = require("../lib/classes/ClassError.class.js"),
    Method = require("metaclass").Method,
    AbstractMethod = require("metaclass").AbstractMethod,
    Visibility = require("metaclass").Visibility,
    checkError = require("./testHelpers/checkError.js");

describe("buildMetaMethod", function () {
    var checkForClassError = checkError(ClassError),
        metaMethod;

    function test(key, value) {
        return buildMetaMethod(key, value, is(value), detect(key, value));
    }

    it("should return an instance of Method", function () {
        expect(is(test("myMethod", function () {})).instanceOf(Method)).to.be(true);
    });
    it("should return an instance of AbstractMethod", function () {
        expect(is(test("?myMethod", function () {})).instanceOf(AbstractMethod)).to.be(true);
    });
    it("should throw an exception if the Method is static and not public", function () {
        expect(function () {
            test("$_myMethod", function () {});
        }).to.throwException(checkForClassError);
        expect(function () {
            test("$__myMethod", function () {});
        }).to.throwException(checkForClassError);
    });
    it("should return the clean method name", function () {
        metaMethod = test("__myMethod", function () {});
        expect(metaMethod.getName()).to.be("myMethod");
    });
    it("should set the visibility appropriately", function () {
        metaMethod = test("myMethod", function () {});
        expect(metaMethod.getVisibility()).to.be(Visibility.PUBLIC);
        metaMethod = test("$myMethod", function () {});
        expect(metaMethod.getVisibility()).to.be(Visibility.PUBLIC);
        metaMethod = test("_myMethod", function () {});
        expect(metaMethod.getVisibility()).to.be(Visibility.PROTECTED);
        metaMethod = test("__myMethod", function () {});
        expect(metaMethod.getVisibility()).to.be(Visibility.PRIVATE);
    });
    it("should set the static-ness appropriately", function () {
        metaMethod = test("myMethod", function () {});
        expect(metaMethod.getStatic()).to.be(false);
        metaMethod = test("$myMethod", function () {});
        expect(metaMethod.getStatic()).to.be(true);
    });
    it("should set the function", function () {
        function myFunc() {}
        metaMethod = test("myMethod", myFunc);
        expect(metaMethod.getFunction()).to.be(myFunc);
    });
});
