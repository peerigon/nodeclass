"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    Class = require("../lib").Class,
    _ = require("underscore");

describe("Class " + (typeof window === "undefined"? "(node)": "(web)"), function () {
    describe("Naming", function () {
        if (typeof Function.prototype.name === "undefined") {
            // break for browsers who don't know function names
            return;
        }
        it("should return a named function when passing a name and a descriptor (not IE)", function () {
            var Named = require("./Class/Naming/Named.class.js");

            expect(Named).to.be.a("function");
            expect(Named.name).to.be("MyClass");
        });
    });
    describe("Attributes", function () {
        var Attributes = require("./Class/Attributes/Attributes.class.js"),
            attributes = new Attributes(),
            attributesThis = attributes.exposeThis();

        it("should add a 'Class'-attribute to every instance", function () {
            expect(attributes.Class).to.be(Attributes);
        });
        it("should accept all primitive instance attributes", function () {
            expect(attributesThis.nullProp).to.be(null);
            expect(attributesThis.booleanProp).to.be(false);
            expect(attributesThis.numberProp).to.be(2);
            expect(attributesThis.stringProp).to.be("hello");
            expect(attributesThis._nullProp).to.be(null);
            expect(attributesThis._booleanProp).to.be(false);
            expect(attributesThis._numberProp).to.be(2);
            expect(attributesThis._stringProp).to.be("hello");
            expect(attributesThis.__nullProp).to.be(null);
            expect(attributesThis.__booleanProp).to.be(false);
            expect(attributesThis.__numberProp).to.be(2);
            expect(attributesThis.__stringProp).to.be("hello");
        });
    });
    describe("Static", function () {
        var Static = require("./Class/Static/Static.class.js");

        it("should make static properties available under the class namespace", function () {
            expect(Static.undefinedProp).to.be(undefined);
            expect(Static.nullProp).to.be(null);
            expect(Static.booleanProp).to.be(false);
            expect(Static.numberProp).to.be(2);
            expect(Static.stringProp).to.be("hello");
            expect(Static.arrProp).to.eql([]);
            expect(Static.objProp).to.eql({});
            expect(Static.exposeThis).to.be.a("function");
        });
        it("should bind all static methods to the Class-object", function () {
            expect(Static.exposeThis()).to.be(Static);
        });
    });
    describe("Visibility", function () {
        var SimpleClass = require("./Class/Visibility/SimpleClass.class.js"),
            simpleClass = new SimpleClass();

        //TODO Add tests for setters and getters
        it("should expose only public functions", function () {
            expect(simpleClass).to.only.have.keys([
                "setUndefinedProp",
                "setNullProp",
                "setBooleanProp",
                "setNumberProp",
                "setStringProp",
                "getUndefinedProp",
                "getNullProp",
                "getBooleanProp",
                "getNumberProp",
                "getStringProp",
                "publicMethod",
                "Class"
            ]);
        });
        it("should add a public getter and setter for non-function properties", function () {
            var SimpleClass = require("./Class/Visibility/SimpleClass.class.js"),
                simpleClass = new SimpleClass();

            expect(simpleClass.getUndefinedProp()).to.be(undefined);
            expect(simpleClass.getNullProp()).to.be(null);
            expect(simpleClass.getBooleanProp()).to.be(false);
            expect(simpleClass.getNumberProp()).to.be(2);
            expect(simpleClass.getStringProp()).to.be("hello");

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
        it("should make static properties prefixed with _ public", function () {
            // because there are no private static properties
            expect(SimpleClass._staticMethod).to.be.a("function");
            expect(SimpleClass.__staticMethod).to.be.a("function");
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
});