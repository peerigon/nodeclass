"use strict";

var isPublic = require("isPublic.js");

/**
 * Returns the Constructor-function. This function is called everytime a new
 * instance is created.
 *
 * @public
 * @param {js.Object} Descriptor
 * @param {js.Function} Wrapper
 * @param {js.Boolean} hasSuperClass
 * @param {js.Function} SuperClass
 * @param {js.Object} DescriptorProperties
 * @return {js.Function} Constructor
 */
var getConstructor = function (Descriptor, Wrapper, hasSuperClass, SuperClass, DescriptorProperties) {

    var instance,
        superInstance,
        wrapper,
        key;

    // NOTE:
    // Be careful when editing the constructor function. Changes to it are very
    // crucial to the overall performance of the application, because the function
    // is called for every new instance.
    var Constructor = function () {

        if (hasSuperClass) {
            superInstance = new SuperClass();
            instance = Object.create(superInstance, DescriptorProperties);
            Constructor.prototype = superInstance;
        } else {
            instance = Object.create(Descriptor);
            //Wrapper.prototype = Constructor;
        }
        //wrapper = Object.create(Constructor);
        if (instance.init && instance.init instanceof Function) {
            instance.init.apply(instance, arguments);
        }
        for (key in Descriptor) {
            if (Descriptor.hasOwnProperty(key)) {
                if (isPublic(key, instance[key])) {
                    this[key] = instance[key].bind(instance);
                    //wrapper[key] = instance[key].bind(instance);
                }
            }
        }
        Object.freeze(this);

        //return wrapper;

    };

    return Constructor;

};

module.exports = getConstructor;