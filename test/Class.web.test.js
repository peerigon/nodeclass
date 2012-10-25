"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    Class = require("../lib/node/Class.js"),
    _ = require("underscore");

//TODO Finish tests for node and web
describe("Class " + (typeof window === "undefined"? "(node)": "(web)"), function () {
    describe("Naming", function () {
        it("should return a named function when passing a name and a descriptor", function () {
            var Named = require("./Class/Naming/Named.class.js");

            expect(Named).to.be.a("function");
            expect(Named.name).to.be("MyClass");
        });
        it("should throw an error when a class uses illegal characters", function () {
            expect(function () {
                var IllegalCharClass = require("./Class/Naming/IllegalCharClass.class.js");
            }).to.throwException();
        });
    });
    describe("Presets", function () {
        var Presets = require("./Class/Presets/Presets.class.js"),
            presets = new Presets(),
            presetsThis = presets.exposeThis();

        it("should preset all primitive instance attributes", function () {
            expect(presetsThis.nullProp).to.be(null);
            expect(presetsThis.numberProp).to.be(2);
            expect(presetsThis.stringProp).to.be("hello");
            expect(presetsThis._nullProp).to.be(null);
            expect(presetsThis._numberProp).to.be(2);
            expect(presetsThis._stringProp).to.be("hello");
            expect(presetsThis.__nullProp).to.be(null);
            expect(presetsThis.__numberProp).to.be(2);
            expect(presetsThis.__stringProp).to.be("hello");
        });
        it("should preset all static attributes (including non-primitives)", function () {
            expect(Presets.nullProp).to.be(null);
            expect(Presets.numberProp).to.be(2);
            expect(Presets.stringProp).to.be("hello");
            expect(Presets.arrProp).to.eql([]);
            expect(Presets.objProp).to.eql({});
        });
        it("should throw an error when trying to preset non-primitive instance attributes", function () {
            expect(function () {
                var NonPrimitivePresets = require("./Class/Presets/NonPrimitivePresets.class.js");
            }).to.throwException();
        });
    });
    describe("Visibility", function () {
        var SimpleClass = require("./Class/Visibility/SimpleClass.class.js"),
            simpleClass = new SimpleClass();

        it("should expose only public functions", function () {
            expect(simpleClass).to.only.have.keys([
                "setUndefinedProp",
                "setNullProp",
                "setNumberProp",
                "setStringProp",
                "getUndefinedProp",
                "getNullProp",
                "getNumberProp",
                "getStringProp",
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
        });
        it("should apply static properties as they are", function () {
            var SimpleClass = require("./Class/Visibility/SimpleClass.class.js");

            expect(SimpleClass.undefinedProp).to.be(undefined);
            expect(SimpleClass.nullProp).to.be(null);
            expect(SimpleClass.numberProp).to.be(2);
            expect(SimpleClass.stringProp).to.be("hello");
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
        var C = require("./Class/Inheritance/C.class.js"),
            B = require("./Class/Inheritance/B.class.js"),
            A = require("./Class/Inheritance/A.class.js"),
            c;

        it("should execute the init function in the right order", function () {
            c = new C();
            expect(A.initCallOrder).to.eql(["C", "B", "A"]);
        });
        it("should pass the init-arguments up the inheritance chain", function () {
            A.initArguments = [];
            c = new C(1, 2, 3);
            expect(A.initArguments).to.eql([[1, 2, 3], [1, 2, 3], []]);
        });
        it("should copy inherited public methods to the child", function () {
            c = new C();
            expect(c.callSuper1("hello")).to.be("hello");
            expect(c.callSuper2("hello")).to.be("hello");
        });
        it("should make protected properties available to the child", function () {
            var instance;

            c = new C();
            instance = c.exposeThis();
            expect(instance.Super._protectedMethod).to.be.a(Function);
            expect(instance.Super._protectedProperty).to.be(undefined);
            instance.Super._setProtectedProperty(3);
            expect(instance.Super._getProtectedProperty()).to.be(3);
        });
        it("should hide private properties from the child", function () {
            var instance;

            c = new C();
            instance = c.exposeThis();
            expect(instance.Super.__privateMethod).to.be(undefined);
            expect(instance.Super.__privateProperty).to.be(undefined);
            expect(instance.Super.__getPrivateProperty).to.be(undefined);
            expect(instance.Super.__setPrivateProperty).to.be(undefined);
        });
        it("should return true when checking with the instanceof operator", function () {
            c = new C();

            expect(c instanceof C).to.be(true);
            expect(c instanceof B).to.be(true);
            expect(c instanceof A).to.be(true);
        });
        it("should not inherit static properties", function () {
            expect(C.initCallOrder).to.be(undefined);
        });
    });
    describe("Overriding", function () {
        var C = require("./Class/Overriding/C.class.js"),
            c = new C(),
            cThis = c.exposeCThis(),
            bThis = c.exposeBThis(),
            aThis = c.exposeAThis();

        it("should override all public methods in the inheritance chain", function () {
            expect(aThis.getClassNames()).to.be(cThis.getClassNames());
            expect(bThis.getClassNames()).to.be(cThis.getClassNames());
        });
        it("should override all protected methods in the inheritance chain", function () {
            expect(aThis._getClassNames()).to.be(cThis._getClassNames());
            expect(bThis._getClassNames()).to.be(cThis._getClassNames());
        });
        it("should not override all private methods in the inheritance chain", function () {
            expect(aThis.__getClassNames()).not.to.be(cThis.__getClassNames());
            expect(bThis.__getClassNames()).not.to.be(cThis.__getClassNames());
        });
        it("should still be possible to call the overridden method via this.Super", function () {
            expect(cThis.getClassNames()).to.be("C B A");
        });
    });
    describe("Static", function () {
        var SimpleClass = require("./Class/Visibility/SimpleClass.class.js");

        it("should make static properties prefixed with _ public", function () {
            // because there are no private static properties
            expect(SimpleClass._staticMethod).to.be.a("function");
            expect(SimpleClass.__staticMethod).to.be.a("function");
        });
    });
});