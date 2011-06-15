var assert = require('assert'),
    build = require('../../lib/build'),
    _ = require('underscore'),
    vm = require('vm'),
    src,
    init,
    sandbox = {
        "exports": null,
        "console": console
    },
    ErrorClassModule = require('node.class/test/build/ErrorClass.class'),
    ErrorClass,
    testClass,
    SuperSuperClassModule = require('node.class/test/build/SuperSuperClass.class'),
    SuperSuperClass;

function log(txt) {
    console.log(txt.replace(/([\{\}\;])/gi, "$1\n"));
}

function compile() {
    sandbox.exports = ErrorClassModule;
    src = build('node.class/test/build/ErrorClass.class', false);
    vm.runInNewContext(src, sandbox);
    ErrorClass = ErrorClassModule.Constructor;

    sandbox.exports = SuperSuperClassModule;
    src = build('node.class/test/build/SuperSuperClass.class', false);
    vm.runInNewContext(src, sandbox);

    if(ErrorClassModule.InitConstructor) {
        ErrorClassModule.InitConstructor();
    }
}

///////////////////////////////////////////////////////////////////////////////////////

assert.throws(function() {
    build("");
});

assert.throws(function() {
    build({});
});

assert.throws(function() {
    build('node.class/test/build/ErrorClass.class', false);
});

init = ErrorClassModule.Class.init;
delete ErrorClassModule.Class.init;
ErrorClassModule.Class.initialize = false;
assert.throws(function() {
    build('node.class/test/build/ErrorClass.class', false);
});

ErrorClassModule.Class.init = init;
delete ErrorClassModule.Class.initialize;
compile();
assert.throws(function() {
    var test = new ErrorClass();
});

ErrorClassModule.Class.abstract = false;
assert.throws(function() {
    build('node.class/test/build/ErrorClass.class', false);
});

delete ErrorClassModule.Extends;
compile();
assert.throws(function() {
    var test = new ErrorClass();
});

ErrorClassModule.Class["?anotherAbstract"] = false;
assert.throws(function() {
    build('node.class/test/build/ErrorClass.class', false);
});

delete ErrorClassModule.Class["?anotherAbstract"];
compile();
assert.throws(function() {
    var test = new ErrorClass();
});