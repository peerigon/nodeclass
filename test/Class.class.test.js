"use strict";

var expect = require("expect.js"),
    Class = require("../lib/Class.class"),
    TestClass,
    myTestClass;

describe("Class", function () {

    it("should return a function", function () {

        TestClass = new Class({});
        expect(TestClass).to.be.a(Function);

    });

});

describe("TestClassWithOutConstructor", function () {

    it("should not fail", function () {

        TestClass = new Class({});
        myTestClass = new TestClass();
        // no need of assertion here since any error will break the test

    });

    it("should be an instance of TestClass", function () {

        TestClass = new Class({});
        myTestClass = new TestClass();
        expect(myTestClass instanceof TestClass).to.be(true);

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
        expect(hasBeenCalled).to.be(false);
        myTestClass = new TestClass();
        expect(hasBeenCalled).to.be(true);

    });

    it("should accept parameters", function () {

        var receivedParam1,
            receivedParam2;

        TestClass = new Class({
            init: function (param1, param2) {

                receivedParam1 = param1;
                receivedParam2 = param2;

            }
        });
        myTestClass = new TestClass();
        expect(receivedParam1).to.be(undefined);
        expect(receivedParam2).to.be(undefined);
        receivedParam1 = undefined;
        receivedParam2 = undefined;
        myTestClass = new TestClass("this is param 1");
        expect(receivedParam1).to.be("this is param 1");
        expect(receivedParam2).to.be(undefined);
        receivedParam1 = undefined;
        receivedParam2 = undefined;
        myTestClass = new TestClass("this is param 1", "this is param 2");
        expect(receivedParam1).to.be("this is param 1");
        expect(receivedParam2).to.be("this is param 2");

    });

    it("should not be able to return a value", function () {

        TestClass = new Class({
            init: function () {

                return "Hello, if proper coded I will not do anything";

            }
        });
        myTestClass = new TestClass();
        expect(myTestClass).to.be.an("object");
        expect(myTestClass instanceof TestClass).to.be(true);

    });

});

/*

describe("TestClass", function () {

    var TestClass;

    before(function () {
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
    });

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