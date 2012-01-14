"use strict";

var expect = require("expect.js"),
    Class = require("../lib/Class.class"),
    TestClass,
    myTestClass;

describe("Class", function () {
    it("should return a function", function () {
        TestClass = new Class({});
        expect(TestClass).to.be.a("function");
    });
});

describe("TestClassWithConstructor", function () {
   it("should have a called constructor", function () {
       var hasBeenCalled = false;

       TestClass = new Class({
           init: function () {
               hasBeenCalled = true;
           }
       });

       expect(hasBeenCalled).to.be("true");
   })
});


describe("TestClass", function () {

    var TestClass;

    /*before(function () {
        TestClass = new Class({
            someProperty : "propertyValue",
            __constructorCalled : false,
            __privateProperty : "privateValue",
            init: function (param1) {

                //mark class as instantiated
                console.log("init called!");
                this._constructorCalled = true;

            },
            getParam1: function (value) {

                return this.someProperty;

            },
            setParam1: function (newValue) {

                this.someProperty = newValue;

            },
            doesExist : function () {
                return this._constructorCalled;
            }
        });
    });*/

    it("should return a function", function () {

        TestClass = new Class({});

        expect(TestClass).to.be.a("function");
    });

    it("should be an object after creation", function () {

        var TestClass = new Class({}),
            myTestClass = new TestClass();

        expect(myTestClass).not.to.be("undefined");
    });

    it("should have the defined method", function () {

        var myTestClass = new TestClass("param1Value");

        expect(myTestClass.getParam1).to.be.a("function");

    });

    it("should return properties via defined methods", function () {

        var myTestClass = new TestClass("param1Value");

        expect(myTestClass.getParam1()).to.equal("propertyValue");

    });

    it("properties should be settable via setter", function () {

          var myTestClass = new TestClass("constructPropertyValue");

          myTestClass.setParam1("newValueHere");
          expect(myTestClass.getParam1()).to.equal("newValueHere");

    });

});*/