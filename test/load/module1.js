require('node.class/test/load/module2')  // done wrong without semicolon
var Class1,
    Class3

exports.Prepare = function() {
   Class1 = require('node.class/test/load/Class1.class').Constructor;
   Class3 = require('node.class/test/load/Class3.class').Constructor;
};

exports.doAssert = function() {
    var class1 = new Class1();
    
    class1.assertProperties();
};
