var assert = require('assert'),
    AnotherClass;

exports.Prepare = function() {
    AnotherClass = require('node.class/test/load/AnotherClass.class').Constructor;
};
exports.Class = {
    "init": function(arg1, arg2) {
        this.isSuperSuperClassInit = !this.isSuperSuperClassInit;
        this.__args = [arg1, arg2];
        this.anotherClass = new AnotherClass();
        assert.ok(typeof AnotherClass === "function");
    },
    "__args": null,
    "getArgs": function() {
        return this.__args;
    },
    "isSuperSuperClassInit": false,
    "assertProperties": function() {
        assert.ok(this.init === undefined);
        assert.ok(this.__args instanceof Array);
        assert.ok(typeof this.getArgs === "function");
        assert.ok(typeof this.assertProperties === "function");
        assert.ok(typeof this.isSuperSuperClassInit === "boolean");
        assert.ok(typeof this.abstract === "function");
        assert.ok(this["?abstract"] === undefined);    
        assert.ok(typeof this.showThis === "function");
        assert.ok(this.Super === undefined);
    },
    "?abstract": Function,
    "anotherClass": AnotherClass,
    "showThis": function() {
        console.log(this);
    }
};
