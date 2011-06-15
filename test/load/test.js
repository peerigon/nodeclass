var assert = require('assert'),
    _ = require('underscore'),
    load = require('node.class/lib/load');

///////////////////////////////////////////////////////////////////////////////////////

load('node.class/test/load/node_modules');

///////////////////////////////////////////////////////////////////////////////////////

var Class1 = require('node.class/test/load/Class1.class.js').Constructor,
    class1_1 = new Class1(),
    class1_2 = new Class1();
    
///////////////////////////////////////////////////////////////////////////////////////



assert.equal(class1_1.getAnotherClass().getName(), "anotherClass");
assert.notEqual(class1_1.getAnotherClass(), class1_2.getAnotherClass());