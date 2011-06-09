var assert = require('assert');

exports.Class = {
    "init": function(arg1, arg2) {
        this.isSuperSuperClassInit = !this.isSuperSuperClassInit;
        this.__args = [arg1, arg2];
    },
    "__args": null,
    "getArgs": function() {
        return this.__args;
    },
    "isSuperSuperClassInit": false,
    "assertProperties": function() {
        assert.ok(this.init === undefined);
        assert.ok(this.__args instanceof Array);
        assert.ok(typeof this.__privateStuff === "number");
        assert.ok(typeof this.getArgs === "function");
        assert.ok(typeof this.assertProperties === "function");
        assert.ok(typeof this.isSuperSuperClassInit === "boolean");
        assert.ok(typeof this.abstract === "function");
        assert.ok(this["?abstract"] === undefined);
        assert.ok(typeof this.setPrivateStuff === "function");
        assert.ok(typeof this._getPrivateStuff === "function");        
        assert.ok(typeof this.showThis === "function");
        assert.ok(typeof this.callAbstract === "function");
        assert.ok(this.Super === undefined);
    },
    "?abstract": Function,
    "callAbstract": function() {
        return this.abstract();
    },
    "__privateStuff": 23,
    "_getPrivateStuff": function() {
        return this.__privateStuff;
    },
    "setPrivateStuff": function(value) {
        this.__privateStuff = value;
    },
    "showThis": function() {
        console.log(this);
    }
};

// example
var Module = this;
exports.Constructor = function() {
    var tmp,
        implChildAbstracts,
        implAbstracts,
        exposeProtected,
        exposeNothing,
        initialized,
        Properties,
        key;
    
    if(exports.Constructor.$) {
        tmp = exports.Constructor.$;
        implChildAbstracts = tmp.implChildAbstracts;
        exposeProtected = tmp.exposeProtected;
        exposeNothing = tmp.exposeNothing;
        initialized = tmp.initialized;
    }

    if(!exposeNothing) {
        Properties = {};

        Properties.isSuperSuperClassInit = false;
        Properties.__args = null;
        Properties.getArgs = exports.Class.getArgs.bind(Properties);
        Properties._getPrivateStuff = exports.Class._getPrivateStuff.bind(Properties);
        Properties.setPrivateStuff = exports.Class.setPrivateStuff.bind(Properties);
        Properties.__privateStuff = 23;
        Properties.assertProperties = exports.Class.assertProperties.bind(Properties);
        Properties.showThis = exports.Class.showThis.bind(Properties);
        Properties.callAbstract = exports.Class.callAbstract.bind(Properties);
    
        this.showThis = exports.Class.showThis.bind(Properties);
        this.getArgs = exports.Class.getArgs.bind(Properties);
        this.setIsSuperSuperClassInit = function(value) {
            Properties.isSuperSuperClassInit = value;
        };
        this.getIsSuperSuperClassInit = function() {
            return Properties.isSuperSuperClassInit;
        };
        this.assertProperties = exports.Class.assertProperties.bind(Properties);
        this.callAbstract = exports.Class.callAbstract.bind(Properties);
        this.setPrivateStuff = exports.Class.setPrivateStuff.bind(Properties);

        if(implAbstracts) {
            for(key in implChildAbstracts) {
                implAbstracts[key] = implChildAbstracts[key];
                Properties[key] = implChildAbstracts[key];
            }
        } else {
            implAbstracts = implChildAbstracts;
            for(key in implChildAbstracts) {
                Properties[key] = implChildAbstracts[key];
            }
        }

        if(exposeProtected) {
            this.getPrivateStuff = exports.Class._getPrivateStuff.bind(Properties);
        }

        exports.Class.init.apply(Properties, arguments);
    }

    delete exports.Constructor.$;
};
exports.Constructor.$construct = function(args) {
    function Instance() {
        return exports.Constructor.apply(this, args);
    }
    Instance.prototype = exports.Constructor.prototype;
    return new Instance();
};