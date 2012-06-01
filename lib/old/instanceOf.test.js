"use strict";

var expect = require("expect.js"),
    instanceOf = require("instanceOf.js");

describe("instanceOf", function () {

    var TestClass = {},
        myTestClass,
        OtherTestClass = {},
        myOtherTestClass,
        SuperTestClass = {},
        mySuperTestClass;

    before(function () {
        function Constructor(Class, Super) {
            this.Class = Class;
            this.Super = Super;
            this.instanceOf = instanceOf.bind(this);
        }

        mySuperTestClass = new Constructor(SuperTestClass);
        myTestClass = new Constructor(TestClass, mySuperTestClass);
        myOtherTestClass = new Constructor(OtherTestClass);
    });

    it("should return true", function () {

        expect(myTestClass.instanceOf(TestClass)).to.be(true);

    });

    it("should return true", function () {

        expect(myTestClass.instanceOf(SuperTestClass)).to.be(true);

    });

    it("should return false", function () {

        expect(myOtherTestClass.instanceOf(TestClass)).to.be(false);

    });

    it("should return false", function () {

        expect(myOtherTestClass.instanceOf(SuperTestClass)).to.be(false);

    });

});