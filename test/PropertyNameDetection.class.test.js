"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    PropertyNameDetection = require("../lib/classes/PropertyNameDetection.class");

describe("PropertyNameDetection", function () {
    describe("#constructor", function () {
        function test(propName) {
            return PropertyNameDetection.detectConstructor(propName);
        }

        it("should detect property name 'construct'", function () {
            var result = test("construct");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
            expect(result.constructorName).to.be("construct");
        });
        it("should detect property name '_construct'", function () {
            var result = test("_construct");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
            expect(result.constructorName).to.be("construct");
        });
        it("should detect property name '__construct'", function () {
            var result = test("__construct");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
            expect(result.constructorName).to.be("construct");
        });
        it("should detect property name 'init'", function () {
            var result = test("init");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
            expect(result.constructorName).to.be("init");
        });
        it("should detect property name '_init'", function () {
            var result = test("_init");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
            expect(result.constructorName).to.be("init");
        });
        it("should detect property name '__init'", function () {
            var result = test("__init");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
            expect(result.constructorName).to.be("init");
        });
        it("should detect property name 'initialize'", function () {
            var result = test("initialize");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
            expect(result.constructorName).to.be("initialize");
        });
        it("should detect property name '_initialize'", function () {
            var result = test("_initialize");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
            expect(result.constructorName).to.be("initialize");
        });
        it("should detect property name '__initialize'", function () {
            var result = test("__initialize");

            expect(result.isConstructor).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
            expect(result.constructorName).to.be("initialize");
        });

        // Checking possible false-detects
        it("should not detect property name 'initSomething'", function () {
            expect(test("initSomething").isConstructor).to.be(false);
        });
        it("should not detect property name 'constructSomething'", function () {
            expect(test("constructSomething").isConstructor).to.be(false);
        });
        it("should not detect property name 'something_init'", function () {
            expect(test("something_init").isConstructor).to.be(false);
        });
        it("should not detect property name 'something_construct'", function () {
            expect(test("something_construct").isConstructor).to.be(false);
        });
    });
    describe("#detectPrefixes", function () {
        function test(propName) {
            return PropertyNameDetection.detectPrefixes(propName);
        }

        it("should detect 'someProperty' as non-abstract, non-static, public", function () {
            var result = test("someProperty");

            expect(result.isAbstract).to.be(false);
            expect(result.isStatic).to.be(false);
            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '_someProperty' as non-abstract, non-static, protected", function () {
            var result = test("_someProperty");

            expect(result.isAbstract).to.be(false);
            expect(result.isStatic).to.be(false);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '__someProperty' as non-abstract, non-static, private", function () {
            var result = test("__someProperty");

            expect(result.isAbstract).to.be(false);
            expect(result.isStatic).to.be(false);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '$someProperty' as non-abstract, static, public", function () {
            var result = test("$someProperty");

            expect(result.isAbstract).to.be(false);
            expect(result.isStatic).to.be(true);
            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '$_someProperty' as non-abstract, static, protected", function () {
            var result = test("$_someProperty");

            expect(result.isAbstract).to.be(false);
            expect(result.isStatic).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '$__someProperty' as non-abstract, static, private", function () {
            var result = test("$__someProperty");

            expect(result.isAbstract).to.be(false);
            expect(result.isStatic).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '?someProperty' as abstract, non-static, public", function () {
            var result = test("?someProperty");

            expect(result.isAbstract).to.be(true);
            expect(result.isStatic).to.be(false);
            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '?_someProperty' as abstract, non-static, protected", function () {
            var result = test("?_someProperty");

            expect(result.isAbstract).to.be(true);
            expect(result.isStatic).to.be(false);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        // There are no abstract private properties, but we need it for error reporting
        it("should detect '?__someProperty' as abstract, non-static, private", function () {
            var result = test("?__someProperty");

            expect(result.isAbstract).to.be(true);
            expect(result.isStatic).to.be(false);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '?$someProperty' as abstract, static, public", function () {
            var result = test("?$someProperty");

            expect(result.isAbstract).to.be(true);
            expect(result.isStatic).to.be(true);
            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        it("should detect '?$_someProperty' as abstract, static, protected", function () {
            var result = test("?$_someProperty");

            expect(result.isAbstract).to.be(true);
            expect(result.isStatic).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
            expect(result.propertyName).to.be("someProperty");
        });
        // There are no abstract private properties, but we need it for error reporting
        it("should detect '?$__someProperty' as abstract, static, private", function () {
            var result = test("?$__someProperty");

            expect(result.isAbstract).to.be(true);
            expect(result.isStatic).to.be(true);
            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
            expect(result.propertyName).to.be("someProperty");
        });

        // Checking possible false-detects
        it("should not detect 'some__Property' as private", function () {
            var result = test("some__Property");

            expect(result.isPrivate).to.be(false);
        });
        it("should not detect 'some_Property' as protected", function () {
            var result = test("some_Property");

            expect(result.isProtected).to.be(false);
        });
        it("should not detect 'make$$$' as static", function () {
            var result = test("make$$$");

            expect(result.isStatic).to.be(false);
        });
        it("should not detect 'wat?' as abstract", function () {
            var result = test("wat?");

            expect(result.isAbstract).to.be(false);
        });
    });
    describe("#detectSuperClass", function () {
        function test(propName) {
            return PropertyNameDetection.detectSuperClass(propName);
        }

        it("should detect 'Extends'", function () {
             expect(test("Extends")).to.be(true);
        });
        it("should detect 'extends'", function () {
             expect(test("extends")).to.be(true);
        });

        // Checking possible false-detects
        it("should not detect 'extendsSomething'", function () {
             expect(test("extendsSomething")).to.be(false);
        });
        it("should not detect 'somethingExtends'", function () {
             expect(test("somethingExtends")).to.be(false);
        });
    });
    describe("#detectInterfaces", function () {
        function test(propName) {
            return PropertyNameDetection.detectInterfaces(propName);
        }

        it("should detect 'Implements'", function () {
             expect(test("Implements")).to.be(true);
        });
        it("should detect 'implements'", function () {
             expect(test("implements")).to.be(true);
        });

        // Checking possible false-detects
        it("should not detect 'implementsSomething'", function () {
             expect(test("implementsSomething")).to.be(false);
        });
        it("should not detect 'somethingImplements'", function () {
             expect(test("somethingImplements")).to.be(false);
        });
    });
    describe("#detectNamingConflicts", function () {
        function test(propName) {
            return PropertyNameDetection.detectNamingConflicts(propName);
        }

        it("should detect '$@'", function () {
             expect(test("$@")).to.be(true);
        });
        // Checking possible false-detects
        it("should not detect '@'", function () {
             expect(test("@")).to.be(false);
        });
        it("should not detect '$@something'", function () {
             expect(test("$@something")).to.be(false);
        });

        it("should detect '$Extends'", function () {
             expect(test("$Extends")).to.be(true);
        });
        // Checking possible false-detects
        it("should not detect 'Extends'", function () {
             expect(test("Extends")).to.be(false);
        });
        it("should not detect '$ExtendsSomething'", function () {
             expect(test("$ExtendsSomething")).to.be(false);
        });
        
        it("should detect '$Implements'", function () {
             expect(test("$Implements")).to.be(true);
        });
        // Checking possible false-detects
        it("should not detect 'Implements'", function () {
             expect(test("Implements")).to.be(false);
        });
        it("should not detect '$ImplementsSomething'", function () {
             expect(test("$ImplementsSomething")).to.be(false);
        });        
    });
});