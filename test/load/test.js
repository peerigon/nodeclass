var assert = require('assert'),
    _ = require('underscore'),
    load = require('node.class/lib/load'),
    requirments;
    
requirements = load('node.class/test/load');

///////////////////////////////////////////////////////////////////////////////////////

var keys,
    basePath;
keys = _(requirements).keys();
_(keys).each(function eachKey(item) {
    assert.ok(require.resolve(item));
    _(requirements[item]).each(function eachRequirement(item) {
        assert.ok(require.resolve(item));
    });
});

///////////////////////////////////////////////////////////////////////////////////////

var module1 = require('node.class/test/load/module1.js');

module1.doAssert();

///////////////////////////////////////////////////////////////////////////////////////

var Class1 = require('node.class/test/load/Class1.class.js').Constructor,
    class1_1 = new Class1(),
    class1_2 = new Class1();

assert.equal(class1_1.getAnotherClass().getName(), "anotherClass");
assert.notEqual(class1_1.getAnotherClass(), class1_2.getAnotherClass());