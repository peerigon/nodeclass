var assert = require('assert');

exports.Extends = require('node.class/test/load/Class2.class');
exports.Class = {
    "init": function(arg1, arg2) {
        this.isClassInit = !this.isClassInit;
        this.__args = [arg1, arg2];
        assert.ok(typeof this.Super === "function");
        this.Super("different argument 1", "different argument 2");
        assert.ok(this.Super instanceof exports.Extends.Constructor);
    },
    "__args": null,
    "getArgs": function() {
        return this.__args.concat(this.Super.getArgs());
    },
    "assertProperties": function() {
        assert.ok(this.init === undefined);
        assert.ok(this.__args instanceof Array);
        assert.ok(typeof this.getArgs === "function");
        assert.ok(typeof this.assertProperties === "function");
        assert.ok(typeof this.isClassInit === "boolean");
        assert.ok(this.setIsClassInit === undefined);
        assert.ok(this.getIsClassInit === undefined);
        assert.ok(this.setIsSuperClassInit === undefined);
        assert.ok(this.getIsSuperClassInit === undefined);
        assert.ok(exports.Constructor.staticString === "static");
        assert.ok(typeof this.abstract === "function");
        assert.ok(typeof this.showThis === "function");
        assert.ok(typeof this.getPrivateStuffFromSuper === "function");
        assert.ok(this.Super.__args === undefined);
        assert.ok(typeof this.Super.getArgs === "function");
        assert.ok(typeof this.Super.assertProperties === "function");
        assert.ok(typeof this.Super.getIsSuperClassInit === "function");
        assert.ok(typeof this.Super.setIsSuperClassInit === "function");
        assert.ok(typeof this.Super.getIsSuperSuperClassInit === "function");
        assert.ok(typeof this.Super.setIsSuperSuperClassInit === "function");
        assert.ok(typeof this.Super.setProtectedStuff === "function");
        assert.ok(typeof this.Super.getProtectedStuff === "function");
        assert.ok(typeof this.Super.showThis === "function");
        this.Super.assertProperties();
    },
    "isClassInit": false,
    "$staticString": "static",
    "abstract": function() {
        return "i am not abstract anymore";
    },
    "showThis": function() {
        console.log(this);
        this.Super.showThis();
    },
    "getPrivateStuffFromSuper": function() {
        return this.Super.getPrivateStuff();
    }
};