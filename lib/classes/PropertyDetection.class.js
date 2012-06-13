"use strict";

var is = require("metaclass").helpers.is,
    isNodeClassConstructor = require("../helpers/isNodeClassConstructor.js");

/** @typedef {isAbstract: {Boolean}, isStatic: {Boolean}, isPublic: {Boolean}, isProtected: {Boolean}, isPrivate: {Boolean}, isAttribute: {Boolean}, isMethod: {Boolean}, isSuperClass: {Boolean}, isInterfaces: {Boolean}, isConstructor: {Boolean}, propertyName: {String}} */
var DetectionResult;

/**
 * This class bundles different functions to get some information about the property.
 * All functions are called with parameters propertyName & propertyValue. This way you can make your own
 * PropertyDetection class and create your own dialect.
 *
 * @static
 */
function PropertyDetection() {}

/**
 * Captures information about abstract-ness, static-ness, the visibility,
 * if a property is a constructor,
 * if a property declares the super class,
 * if a property declares all implemented interfaces
 * and whether a property is an attribute or a method.
 *
 * Returns an object structured like this:
 * {
 *     isAbstract: {Boolean}
 *     isStatic: {Boolean}
 *     isPublic: {Boolean}
 *     isProtected: {Boolean}
 *     isPrivate: {Boolean},
 *     isAttribute: {Boolean},
 *     isMethod: {Boolean},
 *     isSuperClass: {Boolean},
 *     isInterfaces: {Boolean},
 *     isConstructor: {Boolean},
 *     propertyName: {String} the clean property name without prefixes
 * }
 *
 * @static
 * @param {!String} propertyName
 * @param {*} propertyValue
 * @return {DetectionResult}
 */
PropertyDetection.detect = function (propertyName, propertyValue) {
    var result = /^(\??)(\$?)(_{0,2})(.*)/.exec(propertyName),
        visibility = result && result[3],
        cleanPropertyName = result[4],
        isAMethod = isMethod(propertyValue);

    // Determining visibility
    if (visibility === undefined) {
        visibility = -1;
    } else {
        visibility = result[3].length;
    }

    return {
        isAbstract: result[1] === "?",
        isStatic: result[2] === "$",
        isPublic: visibility === 0,
        isProtected: visibility === 1,
        isPrivate: visibility === 2,
        isAttribute: isAMethod === false,
        isMethod: isAMethod,
        isSuperClass: propertyName === "Extends",
        isInterfaces: propertyName === "Implements",
        isConstructor: cleanPropertyName === "init" ||
                cleanPropertyName === "initialize" ||
                cleanPropertyName === "construct",
        propertyName: cleanPropertyName
    };
};

/**
 * Returns true if the property would override an important object
 * that is added by nodeclass (e.g. the flag object named "@").
 *
 * @static
 * @param {!String} propertyName
 * @return {Boolean}
 */
PropertyDetection.detectNamingConflicts = function (propertyName) {
    // prefixed with $ because all important nodeclass objects are static
    return propertyName === "$@" ||
        propertyName === "$Extends" ||
        propertyName === "$Implements";
};

/**
 * Returns true if the property is a method. If this function returns false
 * the property is an attribute.
 *
 * A method must be an ordinary function, that is not a native constructor
 * (like String, Boolean, etc. WITHOUT Function) and no constructor created by nodeclass.
 *
 * This way you can specify the attribute's type if you don't have an initial value, e.g.:
 * {
 *     count: Number,
 *     name: String,
 *     handler: MyCustomHandler
 * }
 *
 * An exception to this are abstract methods. Abstract methods need a value (because you can't give only a key).
 * There are several possible values for abstract methods, but the most consistent seems to be
 * the native constructor Function, e.g.:
 * {
 *     "?myAbstractMethod": Function
 * }
 *
 *
 * @param {*} propertyValue
 * @return {Boolean}
 */
function isMethod(propertyValue) {
    var valueIs = is(propertyValue);

    return propertyValue === Function ||
        (valueIs.instanceOf(Function) &&
        valueIs.notNativeConstructor() &&
        isNodeClassConstructor(propertyValue) === false);
}

module.exports = Object.freeze(PropertyDetection);