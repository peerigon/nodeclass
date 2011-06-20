var testCase = require('nodeunit').testCase,
    pathUtil = require('path'),
    compile = require('../../lib').compile;

///////////////////////////////////////////////////////////////////////////////////////

var srcPath = __dirname + '/src/node_modules',
    compilePath = __dirname + '/compiled/node_modules';

///////////////////////////////////////////////////////////////////////////////////////

exports.compile = testCase({
    compile: function(test) {
        compile(srcPath, compilePath);
        var Class = require('./compiled/node_modules/Class.class.js'),
            class1 = new Class();
        
        class1.assertProperties();
        test.done();
    }
});