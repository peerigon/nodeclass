var assert = require('assert'),
    fs = require('fs'),
    _ = require('underscore'),
    vm = require('vm'),
    src,
    Class,
    testClass,
    SuperClass,
    testSuperClass,
    SuperSuperClass,
    testSuperSuperClass;

function log(txt) {
    console.log(txt.replace(/([\{\}\;])/gi, "$1\n"));
}

function loadSrc(className) {
    var src = fs.readFileSync(__dirname + '/src/node_modules/' + className + '.js', 'utf8');
    var classModule = {
        "require": function(path) {
            if(path !== 'assert') {
                return loadSrc(path);
            } else {
                return require(path);
            }
        },
        console: console
    }
    
    vm.runInNewContext(src, classModule);
    
    return classModule;
}

function build(className) {
    var buildModule = require('../../lib/build2');
    var src = fs.readFileSync(__dirname + '/src/node_modules/' + className + '.js', 'utf8');
    var classModule = loadSrc(className);
    
    src = src + '\n' + buildModule(className, classModule);
    
    fs.writeFileSync(__dirname + '/compiled/node_modules/' + className + '.js', src);
}

function load(className) {
    return require(__dirname + '/compiled/node_modules/' + className + '.js');
}

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