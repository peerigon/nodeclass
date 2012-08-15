"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    Class = require("../lib/node/Class.js"),
    _ = require("underscore");

//TODO Finish tests and for node and web
describe("Class " + (typeof window === "undefined"? "(node)": "(web)"), function () {
    describe("Naming", function () {
        it("should return a function called 'Constructor' when just passing a descriptor", function () {
            var Unnamed = require("./Class/Naming/Unnamed.class.js");

            expect(Unnamed).to.be.a("function");
            expect(Unnamed.name).to.be("Constructor");
        });
        it("should return a named function when passing a name and a descriptor", function () {
            var Named = require("./Class/Naming/Named.class.js");

            expect(Named).to.be.a("function");
            expect(Named.name).to.be("MyClass");
        });
    });
    describe("Visibility", function () {
        it("should expose only public functions", function () {
            var SimpleClass = require("./Class/Visibility/SimpleClass.class.js"),
                simpleClass = new SimpleClass();

            expect(simpleClass).to.only.have.keys([
                "setUndefinedProp",
                "setNullProp",
                "setNumberProp",
                "setStringProp",
                "setArrProp",
                "setObjProp",
                "getUndefinedProp",
                "getNullProp",
                "getNumberProp",
                "getStringProp",
                "getArrProp",
                "getObjProp",
                "publicMethod"
            ]);
        });
        it("should add a public getter and setter for non-function properties", function () {
            var SimpleClass = require("./Class/Visibility/SimpleClass.class.js"),
                simpleClass = new SimpleClass();

            expect(simpleClass.getUndefinedProp()).to.be(undefined);
            expect(simpleClass.getNullProp()).to.be(null);
            expect(simpleClass.getNumberProp()).to.be(2);
            expect(simpleClass.getStringProp()).to.be("hello");
            expect(simpleClass.getArrProp()).to.eql([]);
            expect(simpleClass.getObjProp()).to.eql({});
        });
        it("should apply static properties as they are", function () {
            var SimpleClass = require("./Class/Visibility/SimpleClass.class.js");

            expect(SimpleClass.undefinedProp).to.be(undefined);
            expect(SimpleClass.nullProp).to.be(null);
            expect(SimpleClass.numberProp).to.be(2);
            expect(SimpleClass.stringProp).to.be("hello");
            expect(SimpleClass.arrProp).to.eql([]);
            expect(SimpleClass.objProp).to.eql({});
            expect(SimpleClass.staticMethod).to.be.a("function");
        });
        it("should use specified getters if present", function () {
            var GettersOverridden = require("./Class/Visibility/GettersOverridden.class.js"),
                gettersOverridden = new GettersOverridden();

            expect(gettersOverridden.getMyNumber1()).to.be(3);
            expect(gettersOverridden.setMyNumber1).to.be.a("function");
            expect(gettersOverridden.getMyNumber2()).to.be(3);
            expect(gettersOverridden.setMyNumber2).to.be(undefined);    // because _myNumber2 is protected
            expect(gettersOverridden.getMyNumber3()).to.be(3);
            expect(gettersOverridden.setMyNumber3).to.be(undefined);    // because __myNumber3 is private
        });
        it("should use specified setters if present", function () {
            var SettersOverridden = require("./Class/Visibility/SettersOverridden.class.js"),
                settersOverridden = new SettersOverridden();

            settersOverridden.setMyNumber1(100);
            settersOverridden.setMyNumber2(100);
            settersOverridden.setMyNumber3(100);
            expect(settersOverridden.getNumbers()).to.eql([2, 2, 2]);
            expect(settersOverridden.getMyNumber1).to.be.a("function");
            expect(settersOverridden.getMyNumber2).to.be(undefined);
            expect(settersOverridden.getMyNumber3).to.be(undefined);
        });
    });
    describe("Inheritance", function () {
        it("should execute the init function in the right order", function () {
            var C = require("./Class/Inheritance/C.class.js"),
                A = require("./Class/Inheritance/A.class.js"),
                c;

            c = new C();
            expect(A.initCallOrder).to.eql(["C", "B", "A"]);
        });
    });
    describe("Mistakes", function () {
        it("should throw an error when a class uses illegal characters", function () {
            expect(function () {
                var IllegalCharClass = require("./Class/Mistakes/IllegalCharClass.class.js");
            }).to.throwException();
        });
        it("should make static properties prefixed with _ public", function () {
            // because there are no private static properties
            var SimpleClass = require("./Class/Visibility/SimpleClass.class.js");

            expect(SimpleClass._staticMethod).to.be.a("function");
            expect(SimpleClass.__staticMethod).to.be.a("function");
        });
    });
});