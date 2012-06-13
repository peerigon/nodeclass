"use strict"; // run code in ES5 strict mode

var expect = require("./testHelpers/expect.js"),
    is = require("metaclass").helpers.is,
    buildMetaClass = require("../lib/metaBuilders/buildMetaClass.js"),
    Class = require("../lib/classes/Class.class.js"),
    ClassError = require("../lib/classes/ClassError.class.js"),
    checkError = require("./testHelpers/checkError.js"),
    Method = require("metaclass").Method;

describe("buildMetaClass", function () {
    var checkForClassError = checkError(ClassError),
        MetaClass;

    it("should create a constructor", function () {
        MetaClass = buildMetaClass({
            construct: function () {}
        });
        expect(is(MetaClass.getConstructor()).instanceOf(Method)).to.be(true);
    });
    it("should set the super class", function () {
        var originalFn = Class.getMetaClass;

        function SuperClass() {}
        function MetaSuperClass() {}

        expect.numOfTests = 2;
        Class.getMetaClass = function (superClass) {  // monkey patching getMetaClass
            expect(superClass)
            return MetaSuperClass;
        };
        MetaClass = buildMetaClass({
            Extends: MetaSuperClass
        });
        expect(is(MetaClass.getConstructor()).instanceOf(Method)).to.be(true);
        Class.getMetaClass = originalFn;    // remove monkey patch
        expect.done();
    });
});
