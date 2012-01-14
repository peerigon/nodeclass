"use strict";

var getConstructor = require("./getConstructor");

/**
 * Initializes the class and returns a constructor function that can be
 * instantiated with the new operator.
 *
 * @param {Object} Descriptor the class descriptor object with all properties
 * @return {Function} Constructor
 */
var Class = function (Descriptor) {

    var DescriptorProperties = {},
        SuperClass = Descriptor.Extends,
        hasSuperClass = SuperClass instanceof Function,
        property;

    var Wrapper = function () {};

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

    return getConstructor(Descriptor, Wrapper, hasSuperClass, SuperClass, DescriptorProperties);

}

module.exports = Class;
