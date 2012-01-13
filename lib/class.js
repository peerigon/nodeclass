"use strict";

function Class(Descriptor) {
    var DescriptorProperties = {},
        SuperClass = Descriptor.Extends,
        hasSuperClass = SuperClass instanceof Function,
        property;

    var Wrapper = function () {};

    var isPublic = function (property) {
        return property.charAt(0) !== "_" && Descriptor[property] instanceof Function;
    };

    if (hasSuperClass) {
        for (property in Descriptor) {
            if (Descriptor.hasOwnProperty(property)) {
                DescriptorProperties[property] = {
                    value: Descriptor[property],
                    enumerable: true,
                    configurable: true,
                    writable: true
                };
            }
        }
    }

    // this special function is used to call the constructor with an argument-array
    // since you cant use the .apply()-method with the new operator.
    return function Constructor() {
        var instance,
            superInstance,
            wrapper,
            property;

        if (hasSuperClass) {
            superInstance = new SuperClass();
            instance = Object.create(superInstance, DescriptorProperties);
            Wrapper.prototype = superInstance;
        } else {
            instance = Object.create(Descriptor);
        }
        wrapper = new Wrapper();
        if (wrapper.init && wrapper.init instanceof Function) {
            wrapper.init.apply(wrapper, arguments);
        }
        /*jslint forin: true*/
        for (property in Descriptor) {
            if (isPublic(property)) {
                wrapper[property] = instance[property].bind(instance);
            }
        }
        Object.freeze(wrapper);

        return wrapper;
    };
}







var SuperClass = new Class({
    superProperty: "Super"
});



























var Class = require('node.class');

var TestClass = new Class({
    Extends: SuperClass,
    init: function (param1, param2) {
        console.log(param1, param2);
    },
    _someProperty: "a",
    setSomeProperty: function (value) {
        this._someProperty = value;
    },
    getSomeProperty: function () {
        return this._someProperty;
    }
});