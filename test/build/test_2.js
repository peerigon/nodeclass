var assert = require('assert'),
    setup = require('./test_setup'),
    build = setup.build,
    load = setup.load,
    Class,
    testClass,
    SuperClass,
    testSuperClass,
    SuperSuperClass,
    testSuperSuperClass;

///////////////////////////////////////////////////////////////////////////////////////

build('Class.class');
build('SuperClass.class');
build('SuperSuperClass.class');

Class = load('Class.class');
SuperClass = load('SuperClass.class');
SuperSuperClass = load('SuperSuperClass.class');


Class.$init();
assert.ok(Class.$init === undefined);

testClass = new Class("argument 1", "argument 2");

testClass.assertProperties();
assert.notEqual(testClass.getIsClassInit(), Class.isClassInit);
assert.notEqual(testClass.getIsSuperClassInit(), Class.isSuperClassInit);
assert.notEqual(testClass.getIsSuperSuperClassInit(), Class.isSuperSuperClassInit);
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