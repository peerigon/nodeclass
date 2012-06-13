"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    PropertyDetection = require("../lib/classes/PropertyDetection.class");

describe("PropertyDetection", function () {
    describe("#detect", function () {
        function test(propName, propValue) {
            return PropertyDetection.detect(propName, propValue);
        }

        // Constructor detection
        it("should detect a property named 'construct', 'init' or 'initialize' (including visibility prefixes) as a constructor", function () {
            expect(test("construct", function () {}).isConstructor).to.be(true);
            expect(test("_construct", function () {}).isConstructor).to.be(true);
            expect(test("__construct", function () {}).isConstructor).to.be(true);
            expect(test("init", function () {}).isConstructor).to.be(true);
            expect(test("_init", function () {}).isConstructor).to.be(true);
            expect(test("__init", function () {}).isConstructor).to.be(true);
            expect(test("initialize", function () {}).isConstructor).to.be(true);
            expect(test("_initialize", function () {}).isConstructor).to.be(true);
            expect(test("__initialize", function () {}).isConstructor).to.be(true);
        });
        it("should detect a property named 'construct', 'init' or 'initialize' as a constructor even if it is not a function", function () {
            // this is important for error reporting
            expect(test("construct", "hello").isConstructor).to.be(true);
            expect(test("init", "hello").isConstructor).to.be(true);
            expect(test("initialize", "hello").isConstructor).to.be(true);
        });
        // Checking possible false-detects
        it("should not detect properties whose names contain 'construct', 'init' or 'initialize'", function () {
            expect(test("initSomething", function () {}).isConstructor).to.be(false);
            expect(test("initializeSomething", function () {}).isConstructor).to.be(false);
            expect(test("constructSomething", function () {}).isConstructor).to.be(false);
            expect(test("something_init", function () {}).isConstructor).to.be(false);
            expect(test("something_initialize", function () {}).isConstructor).to.be(false);
            expect(test("something_construct", function () {}).isConstructor).to.be(false);
        });

        // Visibility detection
        it("should detect 'someProperty' as public", function () {
            var result = test("someProperty", "hello");

            expect(result.isPublic).to.be(true);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(false);
        });
        it("should detect '_someProperty' as protected", function () {
            var result = test("_someProperty", "hello");

            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(true);
            expect(result.isPrivate).to.be(false);
        });
        it("should detect '__someProperty' as private", function () {
            var result = test("__someProperty", "hello");

            expect(result.isPublic).to.be(false);
            expect(result.isProtected).to.be(false);
            expect(result.isPrivate).to.be(true);
        });
        // Checking possible false-detects
        it("should not detect properties whose names contain visibility prefixes", function () {
            expect(test("some__Property", "hello").isPrivate).to.be(false);
            expect(test("some_Property", "hello").isProtected).to.be(false);
        });

         // Static detection
        it("should detect '$someProperty' as static", function () {
             expect(test("$someProperty", "hello").isStatic).to.be(true);
        });
        it("should detect 'someProperty' as non-static", function () {
             expect(test("someProperty", "hello").isStatic).to.be(false);
        });
        // Checking possible false-detects
        it("should not detect properties whose names contain $", function () {
            expect(test("make$$$", "hello").isStatic).to.be(false);
        });

        // Abstract detection
        it("should detect '?someProperty' as abstract", function () {
             expect(test("?someProperty", "hello").isAbstract).to.be(true);
        });
        it("should detect 'someProperty' as non-abstract", function () {
             expect(test("someProperty", "hello").isAbstract).to.be(false);
        });
        // Checking possible false-detects
        it("should not detect properties whose names contain ?", function () {
            expect(test("wat?", "hello").isAbstract).to.be(false);
        });

        // Super class detection
        it("should detect 'Extends' as a super class", function () {
             expect(test("Extends", function () {}).isSuperClass).to.be(true);
        });
        it("should detect 'Extends' as a super class even if it is not a function", function () {
            // this is important for error handling
            expect(test("Extends", "Hello").isSuperClass).to.be(true);
        });
        // Checking possible false-detects
        it("should not detect properties whose names contain extends", function () {
            expect(test("extendsSomething", function () {}).isSuperClass).to.be(false);
            expect(test("somethingExtends", function () {}).isSuperClass).to.be(false);
        });

        // Interface detection
        it("should detect 'Implements' as an interface declaration", function () {
             expect(test("Implements", []).isInterfaces).to.be(true);
        });
        it("should detect 'Implements' as an interface declaration even if it is not an array", function () {
            // this is important for error handling
            expect(test("Implements", "Hello").isInterfaces).to.be(true);
        });
        // Checking possible false-detects
        it("should not detect properties whose names contain implements", function () {
            expect(test("implementsSomething", function () {}).isInterfaces).to.be(false);
            expect(test("somethingImplements", function () {}).isInterfaces).to.be(false);
        });

        // Method detection
        it("should detect an ordinary function as a method", function () {
            expect(test("myMethod", function () {}).isMethod).to.be(true);
            expect(test("myMethod", function () {}).isAttribute).to.be(false);
            expect(test("_myMethod", function () {}).isMethod).to.be(true);
            expect(test("_myMethod", function () {}).isAttribute).to.be(false);
            expect(test("__myMethod", function () {}).isMethod).to.be(true);
            expect(test("__myMethod", function () {}).isAttribute).to.be(false);
        });
        it("should detect abstract properties with value 'Function' as a method", function () {
            expect(test("?myAbstractMethod", Function).isMethod).to.be(true);
            expect(test("?$myAbstractMethod", Function).isMethod).to.be(true);
        });
        it("should detect properties with value 'Function' as a method", function () {
            // needed for error reporting
            expect(test("myMethod", Function).isMethod).to.be(true);
            expect(test("__myMethod", Function).isMethod).to.be(true);
        });

        // Attribute detection
        it("should detect everything except a function as an attribute", function () {
            expect(test("myAttribute", undefined).isAttribute).to.be(true);
            expect(test("myAttribute", undefined).isMethod).to.be(false);
            expect(test("myAttribute", null).isAttribute).to.be(true);
            expect(test("myAttribute", null).isMethod).to.be(false);
            expect(test("myAttribute", 2).isAttribute).to.be(true);
            expect(test("myAttribute", 2).isMethod).to.be(false);
            expect(test("myAttribute", "hello").isAttribute).to.be(true);
            expect(test("myAttribute", "hello").isMethod).to.be(false);
            expect(test("myAttribute", []).isAttribute).to.be(true);
            expect(test("myAttribute", []).isMethod).to.be(false);
            expect(test("myAttribute", {}).isAttribute).to.be(true);
            expect(test("myAttribute", {}).isMethod).to.be(false);
            expect(test("myAttribute", /asd/gi).isAttribute).to.be(true);
            expect(test("myAttribute", /asd/gi).isMethod).to.be(false);
        });
        it("should detect all native constructors (except 'Function') as an attribute", function () {
            // useful for declaring a type for an uninitialized attribute
            expect(test("myAttribute", Boolean).isAttribute).to.be(true);
            expect(test("myAttribute", Boolean).isMethod).to.be(false);
            expect(test("myAttribute", String).isAttribute).to.be(true);
            expect(test("myAttribute", String).isMethod).to.be(false);
            expect(test("myAttribute", Number).isAttribute).to.be(true);
            expect(test("myAttribute", Number).isMethod).to.be(false);
            expect(test("myAttribute", Array).isAttribute).to.be(true);
            expect(test("myAttribute", Array).isMethod).to.be(false);
            expect(test("myAttribute", Object).isAttribute).to.be(true);
            expect(test("myAttribute", Object).isMethod).to.be(false);
        });
        it("should detect all nodeclass constructors as an attribute", function () {
            // useful for declaring a custom-type for an uninitialized attribute

            function MyCustomType() {}

            MyCustomType["@"] = {nodeClass: true};  // faking nodeclass flag object

            expect(test("myAttribute", MyCustomType).isAttribute).to.be(true);
        });

        // Check for clean property name
        it("should clean all prefixes", function () {
            expect(test("someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("?someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("$someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("_someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("?_someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("$_someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("?$_someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("?$_someProperty", "hello").propertyName).to.be("someProperty");
            expect(test("?$__someProperty", "hello").propertyName).to.be("someProperty");
        });
    });
});

/*

describe("PropertyDetection", function () {
    describe("#constructor", function () {
        function test(propName) {
            return PropertyDetection.detectConstructor(propName);
        }


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



    });
    describe("#detectPrefixes", function () {
        function test(propName) {
            return PropertyDetection.detectPrefixes(propName);
        }


    });
    describe("#detectSuperClass", function () {
        function test(propName) {
            return PropertyDetection.detectSuperClass(propName);
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
            return PropertyDetection.detectInterfaces(propName);
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
            return PropertyDetection.detectNamingConflicts(propName);
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
}); */