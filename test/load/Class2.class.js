var assert = require('assert'),
    module1;

exports.Prepare = function() {
    module1 = require("node.class/test/load/module1.js");
};
exports.Extends = require('node.class/test/load/Class3.class');
exports.Class = {
    "init": function(arg1, arg2) {
        this.isSuperClassInit = !this.isSuperClassInit;
        this.__args = [arg1, arg2];
        assert.ok(typeof this.Super === "function");
        assert.ok(typeof module1.doAssert === "function");
    },
    "__args": null,
    "getArgs": function() {
        return this.__args.concat(this.Super.getArgs());
    },
    "assertProperties": function() {
        assert.ok(this.init === undefined);
        assert.ok(this.__args instanceof Array);
        assert.ok(typeof this._protectedStuff === "number");
        assert.ok(typeof this.getArgs === "function");
        assert.ok(typeof this.assertProperties === "function");
        assert.ok(typeof this.isSuperClassInit === "boolean");
        assert.ok(this.setIsSuperClassInit === undefined);
        assert.ok(this.getIsSuperClassInit === undefined);
        assert.ok(typeof this.abstract === "function");
        assert.ok(this["?abstract"] === undefined);
        assert.ok(this.setProtectedStuff === undefined);
        assert.ok(this.getProtectedStuff === undefined);        
        assert.ok(typeof this.showThis === "function");
        assert.ok(this.getPrivateStuffFromSuper === undefined);
        assert.ok(typeof this.Super.getArgs === "function");
        assert.ok(typeof this.Super.assertProperties === "function");
        assert.ok(this.Super.getIsSuperClassInit === undefined);
        assert.ok(this.Super.setIsSuperClassInit === undefined);
        assert.ok(typeof this.Super.getIsSuperSuperClassInit === "function");
        assert.ok(typeof this.Super.setIsSuperSuperClassInit === "function");
        assert.ok(typeof this.Super.showThis === "function");
        this.Super.assertProperties();
    },  
    "isSuperClassInit": false,
    "_protectedStuff": 23,
    "?abstract": Function,
    "showThis": function() {
        console.log(this);
        this.Super.showThis();
    }
};


