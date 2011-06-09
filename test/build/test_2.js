var assert = require('assert'),
    build = require('../../lib/build'),
    _ = require('underscore'),
    vm = require('vm'),
    src,
    sandbox = {
        "exports": null,
        "console": console
    },
    ClassModule = require('node.class/test/build/Class.class'),
    Class,
    testClass,
    SuperClassModule = require('node.class/test/build/SuperClass.class'),
    SuperClass,
    testSuperClass,
    SuperSuperClassModule = require('node.class/test/build/SuperSuperClass.class'),
    SuperSuperClass,
    testSuperSuperClass;

function log(txt) {
    console.log(txt.replace(/([\{\}\;])/gi, "$1\n"));
}

///////////////////////////////////////////////////////////////////////////////////////

sandbox.exports = ClassModule;
src = build('node.class/test/build/Class.class');
vm.runInNewContext(src, sandbox);
Class = ClassModule.Constructor;

sandbox.exports = SuperClassModule;
src = build('node.class/test/build/SuperClass.class');
vm.runInNewContext(src, sandbox);

sandbox.exports = SuperSuperClassModule;
src = build('node.class/test/build/SuperSuperClass.class');
vm.runInNewContext(src, sandbox);

ClassModule.InitConstructor();
assert.ok(ClassModule.InitContructor === undefined);

Class = ClassModule.Constructor;
SuperClass = SuperClassModule.Constructor;
SuperSuperClass = SuperSuperClassModule.Constructor;
testClass = new Class("argument 1", "argument 2");

testClass.assertProperties();
assert.notEqual(testClass.getIsClassInit(), ClassModule.Class.isClassInit);
assert.notEqual(testClass.getIsSuperClassInit(), SuperClassModule.Class.isSuperClassInit);
assert.notEqual(testClass.getIsSuperSuperClassInit(), SuperSuperClassModule.Class.isSuperSuperClassInit);
assert.equal(testClass.getIsClassInit(), true);
assert.equal(testClass.getIsSuperClassInit(), true);
assert.equal(testClass.getIsSuperSuperClassInit(), true);
assert.deepEqual(testClass.getArgs(), ["argument 1","argument 2","different argument 1","different argument 2","different argument 1","different argument 2"]);
assert.equal(testClass.getPrivateStuffFromSuper(), 23);
assert.equal(testClass.callAbstract(), "i am not abstract anymore");
assert.equal(Class.staticString, "static");
assert.ok(testClass instanceof Class);
assert.ok(testClass instanceof SuperClass);
assert.ok(testClass instanceof SuperSuperClass);
testClass.setPrivateStuff(24);
testClass.setIsClassInit(false);
testClass.setIsSuperClassInit(false);
testClass.setIsSuperSuperClassInit(false);
assert.equal(testClass.getPrivateStuffFromSuper(), 24);
assert.equal(testClass.getIsClassInit(), false);
assert.equal(testClass.getIsSuperClassInit(), false);
assert.equal(testClass.getIsSuperSuperClassInit(), false);