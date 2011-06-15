var assert = require('assert');

exports.Extends = require('node.class/test/build/SuperSuperClass.class');
exports.Class = {
    "init": function(arg1, arg2) {
        this.isSuperClassInit = !this.isSuperClassInit;
        this.__args = [arg1, arg2];
        assert.ok(typeof this.Super === "function");
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
        assert.ok(typeof this.Super.callAbstract === "function");
        assert.ok(typeof this.Super.getPrivateStuff === "function");
        assert.ok(typeof this.Super.setPrivateStuff === "function");
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

// example
var Module = this;
exports.Constructor = function() {
    var tmp,
        implChildAbstracts,
        implAbstracts,
        exposeProtected,
        exposeNothing,
        Properties,
        key;
    
    if(exports.Constructor.$) {
        tmp = exports.Constructor.$;
        implChildAbstracts = tmp.implChildAbstracts;
        exposeProtected = tmp.exposeProtected;
        exposeNothing = tmp.exposeNothing;
    }

    if(!exposeNothing) {
        if(!implChildAbstracts) {
            implChildAbstracts = {};
        }

        Properties = {};
        Properties.isSuperClassInit = false;
        Properties._protectedStuff = 23;
        Properties.__args = null;
        Properties.getArgs = exports.Class.getArgs.bind(Properties);
        Properties.assertProperties = exports.Class.assertProperties.bind(Properties);
        Properties.showThis = exports.Class.showThis.bind(Properties);

        this.showThis = exports.Class.showThis.bind(Properties);
        this.getArgs = exports.Class.getArgs.bind(Properties);
        this.assertProperties = exports.Class.assertProperties.bind(Properties);
        this.setIsSuperClassInit = function(value) {
            Properties.isSuperClassInit = value;
        };
        this.getIsSuperClassInit = function() {
            return Properties.isSuperClassInit;
        };
        
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

        Properties.Super = function() {
            exports.Extends.Constructor.$ = {
                "exposeProtected": true,
                "implChildAbstracts": implAbstracts
            }
            Properties.Super = exports.Extends.Constructor.$construct(arguments);
        };

        exports.Class.init.apply(Properties, arguments);

        if(typeof Properties.Super === 'function') {
            Properties.Super.apply(Module, arguments);
        }

        if(exposeProtected) {
            this.setProtectedStuff = function(value) {
                Properties._protectedStuff = value;
            };
            this.getProtectedStuff = function() {
                return Properties._protectedStuff;
            };
            this.getPrivateStuff = Properties.Super.getPrivateStuff;
        }

        this.callAbstract = Properties.Super.callAbstract;
        this.setIsSuperSuperClassInit = Properties.Super.setIsSuperSuperClassInit;
        this.getIsSuperSuperClassInit = Properties.Super.getIsSuperSuperClassInit;
        this.setPrivateStuff = Properties.Super.setPrivateStuff;
    }

    delete exports.Constructor.$;
};

exports.InitConstructor = function() {
    if(exports.Extends.InitConstructor) {
        exports.Extends.InitConstructor();
    }
    exports.Extends.Constructor.$ = {
        "exposeNothing": true
    };
    exports.Constructor.prototype = new exports.Extends.Constructor();
    
    delete exports.InitConstructor;
};

exports.Constructor.$construct = function (args) {
    function Instance() {
        return exports.Constructor.apply(this, args);
    }
    Instance.prototype = exports.Constructor.prototype;
    return new Instance();
};