var assert = require('assert');

exports.Extends = require('node.class/test/build/SuperClass.class');
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
        assert.ok(typeof this.Super.callAbstract === "function");
        assert.ok(typeof this.Super.getPrivateStuff === "function");
        assert.ok(typeof this.Super.setPrivateStuff === "function");
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
        
        Properties.isClassInit = false;
        Properties.__args = null;
        Properties.getArgs = exports.Class.getArgs.bind(Properties);
        Properties.abstract = exports.Class.abstract.bind(Properties);
        Properties.showThis = exports.Class.showThis.bind(Properties);
        Properties.assertProperties = exports.Class.assertProperties.bind(Properties);
        Properties.getPrivateStuffFromSuper = exports.Class.getPrivateStuffFromSuper.bind(Properties);

        this.abstract = exports.Class.abstract.bind(Properties);
        this.showThis = exports.Class.showThis.bind(Properties);
        this.getArgs = exports.Class.getArgs.bind(Properties);
        this.assertProperties = exports.Class.assertProperties.bind(Properties);
        this.setIsClassInit = function(value) {
            Properties.isClassInit = value;
        };
        this.getIsClassInit = function() {
            return Properties.isClassInit;
        };
        this.getPrivateStuffFromSuper = exports.Class.getPrivateStuffFromSuper.bind(Properties);

        implAbstracts = {};
        implAbstracts.abstract = exports.Class.abstract.bind(Properties);

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
            };
            Properties.Super = exports.Extends.Constructor.$construct(arguments);
        };

        exports.Class.init.apply(Properties, arguments);

        if(typeof Properties.Super === 'function') {
            Properties.Super.apply(Module, arguments);
        }

        if(exposeProtected) {
        }

        this.callAbstract = Properties.Super.callAbstract;
        this.setIsSuperClassInit = Properties.Super.setIsSuperClassInit;
        this.getIsSuperClassInit = Properties.Super.getIsSuperClassInit;
        this.getIsSuperSuperClassInit = Properties.Super.getIsSuperSuperClassInit;
        this.setIsSuperSuperClassInit = Properties.Super.setIsSuperSuperClassInit;
        this.setPrivateStuff = Properties.Super.setPrivateStuff;
    }

    delete exports.Constructor.$;
};
exports.Constructor.staticString = "static";

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