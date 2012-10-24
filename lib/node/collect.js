"use strict";

var _ = require("underscore"),
    registry = require("./registry.js");

/**
 * @param {Object} descriptor
 * @param {PropertyMap} propertyMap
 */
function collectProperties(descriptor, propertyMap) {
    var prefix;

    _(descriptor).each(function eachProperty(value, key) {
        prefix = key.charAt(0);
        if (prefix === "_") {
            prefix = key.charAt(1); // now we're looking at the second character
            if (prefix === "_") {    // IF TRUE: private property
                if (isMethod(value)) {
                    propertyMap.private.method[key] = value;
                } else {
                    propertyMap.private.attribute[key] = value;
                }
            } else {    // IF TRUE: protected property
                if (isMethod(value)) {
                    propertyMap.protected.method[key] = value;
                } else {
                    propertyMap.protected.attribute[key] = value;
                }
            }
        } else if (prefix === "$") { // IF TRUE: static property
            if (isMethod(value)) {
                propertyMap.static.method[key] = value;
            } else {
                propertyMap.static.attribute[key] = value;
            }
        } else { // IF TRUE: public property
            if (key === "Extends" || key === "Super") {
                return; // break
            }
            if (key === "init") {
                if (isMethod(value) === false) {    // IF TRUE: the init property is not a function
                    throw new Error('The init method "' + key + '" is not a function.');
                }
                propertyMap.hasInit = true;
            } else if (isMethod(value)) {
                propertyMap.public.method[key] = value;
            } else {
                propertyMap.public.attribute[key] = value;
            }
        }
    });
}

/**
 * @param {Object} descriptor
 * @param {PropertyMap} propertyMap
 */
function collectSuperProperties(descriptor, propertyMap) {
    var superDescriptor;

    if (descriptor.Extends) {    // IF TRUE: this class has a super class. so we're collecting these properties first.
        superDescriptor = registry.getEntry(descriptor.Extends).descriptor;
        collectSuperProperties(superDescriptor, propertyMap);
    }
    collectProperties(descriptor, propertyMap);
}

/**
 * @param {ClassMap} classMap
 */
function collectOverriddenMethods(classMap) {
    var overriddenMethods = classMap.overriddenMethods,
        thisProperties = classMap.properties,
        superProperties = classMap.superProperties;

    _(thisProperties.public.method).each(function eachPublicMethod(value, key) {
        if (superProperties.public.method[key]) {
            overriddenMethods[key] = value;
        }
    });
    _(thisProperties.protected.method).each(function eachProtectedMethod(value, key) {
        if (superProperties.protected.method[key]) {
            overriddenMethods[key] = value;
        }
    });
}

var nativeTypes = [Boolean, Number, String, Array, Object, RegExp, Date];

/**
 * @private
 * @param {*} value
 * @return {Boolean}
 */
function isMethod(value) {
    return typeof value === "function" && _(nativeTypes).indexOf(value) === -1;
}


exports.collectSuperProperties = collectSuperProperties;
exports.collectOverriddenMethods = collectOverriddenMethods;
exports.collectProperties = collectProperties;