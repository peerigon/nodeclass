"use strict";

/** @typedef {isConstructor: {Boolean}, isPublic: {Boolean}, isProtected: {Boolean}, isPrivate: {Boolean}, constructorName: {String}} */
var ConstructorDetectionResult,
/** @typedef {isAbstract: {Boolean}, isStatic: {Boolean}, isPublic: {Boolean}, isProtected: {Boolean}, isPrivate: {Boolean}, propertyName: {String}} */
    PrefixDetectionResult;

/**
 * This class bundles different functions to get some information about the property from the prefixes.
 * All functions are called with parameters propertyName & propertyValue. This way you can make your own
 * PropertyNameDetection class and create your own dialect.
 *
 * @static
 */
function PropertyNameDetection() {}

/**
 * Detects a constructor. Possible constructor names are:
 *
 * - construct
 * - init
 * - initialize
 *
 * Returns an object structured like this:
 * {
 *     isConstructor: {Boolean},
 *     isPublic: {Boolean},
 *     isProtected: {Boolean},
 *     isPrivate: {Boolean},
 *     constructorName: {String},
 * }
 *
 * @static
 * @param {!String} propertyName
 * @return {ConstructorDetectionResult}
 */
PropertyNameDetection.detectConstructor = function (propertyName) {
    var result = /^(_{0,2})(construct|init(?:ialize)?)$/.exec(propertyName),
        constructorName,
        visibility;

    if (result) {
        constructorName = result[2];
        visibility = result[1];
    }

    return {
        isConstructor: constructorName !== undefined,
        isPublic: visibility === "",
        isProtected: visibility === "_",
        isPrivate: visibility === "__",
        constructorName: constructorName
    };
};

/**
 * This regular expression captures information about abstract-ness, static-ness and the visibility
 *
 * Returns an object structured like this:
 * {
 *     isAbstract: {Boolean}
 *     isStatic: {Boolean}
 *     isPublic: {Boolean}
 *     isProtected: {Boolean}
 *     isPrivate: {Boolean},
 *     propertyName: {String} the clean property name without prefixes
 * }
 *
 * @static
 * @param {!String} propertyName
 * @return {PrefixDetectionResult}
 */
PropertyNameDetection.detectPrefixes = function (propertyName) {
    var result = /^(\??)(\$?)(_{0,2})(.*)/.exec(propertyName),
        visibility = result && result[3],
        cleanPropertyName = result[4];

    if (visibility === undefined) {
        visibility = -1;
    } else {
        visibility = result[3].length;  // maybe checking the length is a little bit faster, I don't know
    }

    return {
        isAbstract: result[1] === "?",
        isStatic: result[2] === "$",
        isPublic: visibility === 0,
        isProtected: visibility === 1,
        isPrivate: visibility === 2,
        propertyName: cleanPropertyName
    };
};

/**
 * Detects if the property is the super class.
 *
 * @static
 * @param {!String} propertyName
 * @return {Boolean}
 */
PropertyNameDetection.detectSuperClass = function (propertyName) {
    propertyName = propertyName.toLowerCase();
    return propertyName === "extends";
};

/**
 * Detects the implemented interfaces.
 *
 * @static
 * @param {!String} propertyName
 * @return {Boolean}
 */
PropertyNameDetection.detectInterfaces = function (propertyName) {
    propertyName = propertyName.toLowerCase();
    return propertyName === "implements";
};

/**
 * Returns true if the property would override an important object
 * that is added by nodeclass (e.g. the flag object).
 *
 * @static
 * @param {!String} propertyName
 * @return {Boolean}
 */
PropertyNameDetection.detectNamingConflicts = function (propertyName) {
    return propertyName === "$@" ||
        propertyName === "$Extends" ||
        propertyName === "$Implements";
};

module.exports = Object.freeze(PropertyNameDetection);