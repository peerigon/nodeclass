"use strict"; // run code in ES5 strict mode

var Class = require("../../../../lib/index.js").Class,
    is = require("../../../../lib/index.js").is,
    assert = require("assert"),
    MyClass = require("../MyClass.class.js"),
    MySuperClass = require("../MySuperClass.class.js");

var MyOtherClass = new Class("MyOtherClass", {
    Extends: MyClass,
    isInitCalled: function () {
        return this.Super.isInitCalled();
    },
    $someStatic: true,
    __privateMethod: function () {
        throw new Error("You can't call me");
    },
    checkAccessToProtected: function () {
        assert.equal(this.Super._getProtectedString(), "protected hello");
        this.Super._setProtectedString("changed");
        assert.equal(this.Super._getProtectedString(), "changed");
        assert.equal(this.Super._protectedMethod(), "this is protected");
    },
    checkInstanceOf: function () {
        assert.ok(is(this.Instance).instanceOf(MyOtherClass) === true);
        assert.ok(is(this.Instance).instanceOf(MyClass) === true);
        assert.ok(is(this.Instance).instanceOf(MySuperClass) === true);
    }
});

module.exports = MyOtherClass;