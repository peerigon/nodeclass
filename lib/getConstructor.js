"use strict";

/**
 * Returns true if the property fulfills the requirements of a public property.
 *
 * @private
 * @param {js.String} key
 * @param {js.Object} value
 * @return {js.Boolean}
 */
var isPublic = function (key, value) {
    return key.charAt(0) !== "_" && value instanceof Function;
};

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
        wrapper;

    // NOTE:
    // Be careful when editing the constructor function. Changes to it are very
    // crucial to the overall performance of the application, because the function
    // is called for every new instance.
    return function Constructor() {

        var key;

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
        for (key in Descriptor) {
            if (Descriptor.hasOwnProperty(key)) {
                if (isPublic(key)) {
                    wrapper[key] = instance[key].bind(instance);
                }
            }
        }
        Object.freeze(wrapper);

        return wrapper;

    };

};

module.exports = getConstructor;