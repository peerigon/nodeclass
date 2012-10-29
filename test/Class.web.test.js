"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    Class = require("../lib").Class,
    _ = require("underscore");

var C = require("./Class/C.class.js"),
    B = require("./Class/B.class.js"),
    A = require("./Class/A.class.js"),
    D = require("./Class/D.class.js"),
    E = require("./Class/E.class.js");

describe("Class " + (typeof window === "undefined"? "(node)": "(web)"), function () {
    describe("Naming", function () {
        if (typeof Function.prototype.name === "undefined") {
            // break for browsers who don't know function names
            return;
        }
        it("should return a named function when passing a name and a descriptor (not IE)", function () {
            var Named = require("./Class/Named.class.js");

            expect(Named).to.be.a("function");
            expect(Named.name).to.be("MyClass");
        });
    });
    describe("Attributes", function () {
        var c = new C(),
            cThis = c.exposeCThis(),
            bThis = c.exposeBThis();

        it("should add a 'Class'-attribute to every instance", function () {
            expect(c.Class).to.be(C);
        });
        it("should accept all primitive instance attributes", function () {
            expect(cThis.nullProp).to.be(null);
            expect(cThis.booleanProp).to.be(false);
            expect(cThis.numberProp).to.be(1);
            expect(cThis.stringProp).to.be("c");
            expect(cThis._nullProp).to.be(null);
            expect(cThis._booleanProp).to.be(false);
            expect(cThis._numberProp).to.be(1);
            expect(cThis._stringProp).to.be("c");
            expect(cThis.__nullProp).to.be(null);
            expect(cThis.__booleanProp).to.be(false);
            expect(cThis.__numberProp).to.be(1);
            expect(cThis.__stringProp).to.be("c");

            expect(bThis.nullProp).to.be(null);
            expect(bThis.booleanProp).to.be(false);
            expect(bThis.numberProp).to.be(2);
            expect(bThis.stringProp).to.be("b");
            expect(bThis._nullProp).to.be(null);
            expect(bThis._booleanProp).to.be(false);
            expect(bThis._numberProp).to.be(2);
            expect(bThis._stringProp).to.be("b");
            expect(bThis.__nullProp).to.be(null);
            expect(bThis.__booleanProp).to.be(false);
            expect(bThis.__numberProp).to.be(2);
            expect(bThis.__stringProp).to.be("b");
        });
        it("should add getters to every public non-function property", function () {
            expect(c.getUndefinedProp()).to.be(undefined);
            expect(c.getNullProp()).to.be(null);
            expect(c.getBooleanProp()).to.be(false);
            expect(c.getStringProp()).to.be("c");
        });
        it("should add chainable setters to every public non-function property", function () {
            expect(c.setUndefinedProp("hello")).to.be(c);
            expect(c.setNullProp("hello")).to.be(c);
            expect(c.setBooleanProp("hello")).to.be(c);
            expect(c.setStringProp("hello")).to.be(c);
            expect(c.getUndefinedProp()).to.be("hello");
            expect(c.getNullProp()).to.be("hello");
            expect(c.getBooleanProp()).to.be("hello");
            expect(c.getStringProp()).to.be("hello");
        });
        it("should not add these getters and setters to the inner object", function () {
            expect(cThis.setStringProp).to.be(undefined);
            expect(cThis.getStringProp).to.be(undefined);
        });
        it("should hide meta-properties", function () {
            expect(cThis.init).to.be(undefined);
            expect(cThis.Extends).to.be(undefined);
        });
    });
    describe("Methods", function () {
        it("should be bound to the properties-object", function () {
            var d = new D(),
                dThis = d.exposeDThis();

            var otherObj = {
                // If the methods aren't bound to the properties object exposeThis would now return otherObj
                exposeThis: dThis.exposeDThis
            };

            expect(otherObj.exposeThis()).to.be(dThis);
        });
    });
    describe("Static", function () {
        it("should make static properties available under the class namespace", function () {
            expect(C.nullProp).to.be(null);
            expect(C.booleanProp).to.be(false);
            expect(C.numberProp).to.be(1);
            expect(C.stringProp).to.be("c");
            expect(C.arrProp).to.eql([]);
            expect(C.objProp).to.eql({});
        });
        it("should bind all static methods to the Class-object", function () {
            expect(A.exposeStaticThis()).to.be(A);
        });
    });
    describe("Inheritance", function () {
        var c,
            d,
            dThis,
            cThis,
            bThis,
            aThis;

        it("should execute the init-function in the right order", function () {
            A.initCallOrder = [];
            c = new C();
            expect(A.initCallOrder).to.eql(["C", "B", "A"]);
        });
        it("should pass the init-arguments up the inheritance chain", function () {
            A.initArguments = [];
            c = new C(1, 2, 3);
            expect(A.initArguments).to.eql([[1, 2, 3], [1, 2, 3], []]);
        });
        it("should be possible to omit the init-function", function () {
            d = new D();
            dThis = d.exposeDThis();
            expect(dThis.Super).to.be.an("object");
            expect(dThis.Super).to.be.an(E);
        });
        it("should copy inherited public methods to the child", function () {
            c = new C();
            cThis = c.exposeCThis();
            bThis = c.exposeBThis();
            aThis = c.exposeAThis();
        });
        it("should copy inherited setters and getters to the child", function () {
            c = new C();
            expect(c.setMyStringA).to.be.a("function");
            expect(c.getMyStringA).to.be.a("function");
            expect(c.setMyStringB).to.be.a("function");
            expect(c.getMyStringB).to.be.a("function");
        });
        it("should make public and protected properties available to the child", function () {
            expect(cThis.Super.getClassNames).to.be.a("function");
            expect(cThis.Super._getClassNames).to.be.a("function");
            expect(cThis.Super.getNumberProp).to.be.a("function");
            expect(cThis.Super._getNumberProp).to.be.a("function");
        });
        it("should be possible to use the instanceof operator", function () {
            var Named = require("./Class/Named.class.js");

            c = new C();

            expect(c instanceof C).to.be(true);
            expect(c instanceof B).to.be(true);
            expect(c instanceof A).to.be(true);
            expect(c instanceof Named).to.be(false);
        });
        it("should not inherit static properties", function () {
            expect(C.initCallOrder).to.be(undefined);
        });
    });
    describe("Visibility", function () {
        var c = new C(),
            cThis = c.exposeCThis();

        it("should not expose the 'init'-function", function () {
            expect(c.init).to.be(undefined);
        });
        it("should expose only public functions", function () {
            expect(c).to.only.have.keys([
                "setUndefinedProp",
                "setNullProp",
                "setBooleanProp",
                "setNumberProp",
                "setStringProp",
                "setGreeting",
                "setMyStringA",
                "setMyStringB",
                "getUndefinedProp",
                "getNullProp",
                "getBooleanProp",
                "getNumberProp",
                "getStringProp",
                "getClassNames",
                "getGreeting",
                "getMyStringA",
                "getMyStringB",
                "exposeCThis",
                "exposeBThis",
                "exposeAThis",
                "Class"
            ]);
        });
        it("should expose only public and protected functions to a child", function () {
            expect(cThis.Super).to.only.have.keys([
                "setUndefinedProp",
                "setNullProp",
                "setBooleanProp",
                "setNumberProp",
                "setStringProp",
                "setMyStringA",
                "setMyStringB",
                "_setUndefinedProp",
                "_setNullProp",
                "_setBooleanProp",
                "_setNumberProp",
                "_setStringProp",
                "getUndefinedProp",
                "getNullProp",
                "getBooleanProp",
                "getNumberProp",
                "getStringProp",
                "getClassNames",
                "getMyStringA",
                "getMyStringB",
                "_getUndefinedProp",
                "_getNullProp",
                "_getBooleanProp",
                "_getNumberProp",
                "_getStringProp",
                "_getClassNames",
                "exposeBThis",
                "exposeAThis",
                "_protectedMethodB",
                "_protectedMethodA",
                "Class"
            ]);
        });
        it("should make static properties prefixed with _ public", function () {
            // because there are no private static properties
            expect(A._staticMethod).to.be.a("function");
            expect(A.__staticMethod).to.be.a("function");
        });
    });
    describe("Overriding", function () {
        var c = new C(),
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
        it("should be possible to override the automatic setters and getters", function () {
            c.setGreeting();
            expect(c.getGreeting()).to.be("hello says the setter, hello says the getter");
        });
    });
});