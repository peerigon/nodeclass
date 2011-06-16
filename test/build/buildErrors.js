var testCase = require('nodeunit').testCase,
    buildModule = require('./setup').build,
    load = require('./setup').load,    
    ErrorClass,
    testClass,
    err,
    SuperSuperClass;
    
function build(name) {
    buildModule(name + '.class');
    ErrorClass = load(name + '.class');
}

function tryIt(func) {
    try {
        func();
    } catch(e) {
        err = e.message;
    }
}

module.exports = testCase({
    twoInit: function(test) {
        tryIt(function() {
            build('Error2Init');
        });
        test.equal(err, 'build error in Error2Init.class: found two init methods "initialize" and "init".');
        test.done();
    },
    initNotAFunc: function(test) {
        tryIt(function() {
            build('ErrorInitNonFunc');
        });
        test.equal(err, 'build error in ErrorInitNonFunc.class: the init method "init" is not a function.');
        test.done();
    },
    abstract1Error: function(test) {
        tryIt(function() {
            build('Abstract1Error');
        });
        test.equal(err, 'build error in Abstract1Error.class: you didnt take care of the inherited abstracts function(s) "?abstract".\ndeclare them as abstract or implement them without the "?"-prefix.');
        test.done();
    },
    abstract2Error: function(test) {
        tryIt(function() {
            build('Abstract2Error');
        });
        test.equal(err, 'build error in Abstract2Error.class: you can only define abstract functions.\nhowever, the abstract property "?anotherAbstract" is typeof boolean.');
        test.done();
    },
    abstract3Error: function(test) {
        build('Abstract3Error');
        tryIt(function() {
            testClass = new ErrorClass();
        });
        test.equal(err, 'class error in Abstract3Error.class: you cant instantiate an abstract class.\nthese methods are declared as abstract: "?anotherAbstract", "?abstract".');
        test.done();
    },
    recursionError: function(test) {
        build('RecursionError');
        tryIt(function() {
            testClass = new ErrorClass();
        });
        test.equal(err, 'class error in RecursionError.class: constructor recursion detected.');
        test.done();
    }
});