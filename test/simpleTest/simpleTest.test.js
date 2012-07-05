"use strict"; // run code in ES5 strict mode

var assert = require("assert");

var MyClass = require("./src/MyClass.class.js"),
    MyOtherClass = require("./src/subdir/MyOtherClass.class.js"),
    MySuperClass = require("./src/MySuperClass.class.js"),
    mySuperClass,
    myClass,
    myOtherClass;

myClass = new MyClass();
myOtherClass = new MyOtherClass();

assert.ok(myClass.isInitCalled());
assert.ok(myOtherClass.isInitCalled());
assert.ok(myOtherClass.getSomeNumber() === 2);
myOtherClass.setSomeNumber(3);
assert.ok(myOtherClass.getSomeNumber() === 3);
assert.ok(MyOtherClass.someStatic === true);
assert.ok(myOtherClass.__privateMethod === undefined);
assert.ok(myOtherClass.returnProtected() === "this is protected");
assert.throws(function () {
    mySuperClass = new MySuperClass();
});

myOtherClass.checkInstanceOf();

require("./src/MyClass.class.js");
require("./src/subdir/MyOtherClass.class.js");
require("./src/MySuperClass.class.js");

console.log("everything ok");