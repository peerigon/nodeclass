var assert = require('assert'),
    buildModule = require('./test_setup').build,
    load = require('./test_setup').load,    
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

///////////////////////////////////////////////////////////////////////////////////////

tryIt(function() {
    build('Error2Init');
});
assert.equal(err, 'build error in Error2Init.class: found two init methods "initialize" and "init".');

///////////////////////////////////////////////////////////////////////////////////////

tryIt(function() {
    build('ErrorInitNonFunc');
});
assert.equal(err, 'build error in ErrorInitNonFunc.class: the init method "init" is not a function.');

///////////////////////////////////////////////////////////////////////////////////////

tryIt(function() {
    build('Abstract1Error');
});
assert.equal(err, 'build error in Abstract1Error.class: you didnt take care of the inherited abstracts function(s) "?abstract".\ndeclare them as abstract or implement them without the "?"-prefix.');

///////////////////////////////////////////////////////////////////////////////////////

tryIt(function() {
    build('Abstract2Error');
});
assert.equal(err, 'build error in Abstract2Error.class: you can only define abstract functions.\nhowever, the abstract property "?anotherAbstract" is typeof boolean.');

///////////////////////////////////////////////////////////////////////////////////////

build('Abstract3Error');
tryIt(function() {
    testClass = new ErrorClass();
});
assert.equal(err, 'class error in Abstract3Error.class:\nyou cant instantiate an abstract class. these methods are declared as abstract: "?anotherAbstract", "?abstract".');

///////////////////////////////////////////////////////////////////////////////////////    

build('RecursionError');
tryIt(function() {
    testClass = new ErrorClass();
});
assert.equal(err, 'class error in RecursionError.class:\nconstructor recursion detected.');

///////////////////////////////////////////////////////////////////////////////////////