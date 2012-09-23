"use strict";

var _ = require('underscore'),
    registry = require("./registry.js");

var nativeTypes = [Boolean, Number, String, Array, Object, RegExp, Date];

function isMethod(value) {
    return typeof value === "function" && nativeTypes.indexOf(value) === -1;
}

/**
 * Collects all properties of the descriptor and returns them separated by their visibility and functionality.
 *
 * The returned object is structured like this:
 * {
 *     Init: null,
 *     Private: { Function: {}, Other: {} },
 *     Protected: { Function: {}, Other: {} },
 *     Public: { Function: {}, Other: {} },
 *     Abstract: {},
 *     Static: { Function: {}, Other: {} }
 * }
 * 
 * @param {Object} descriptor the class descriptor
 * @param {Object=} result This object will be filled with all collected properties. Must be structured as described above.
 * @return {Object} result
 */
function collectProperties(descriptor, result) {
    var prefix,
        hasInit = false;

    if (!result) { // if the result object is not set, we create an empty one.
        result = {
            Init: null,
            Private: { Function: {}, Other: {} },
            Protected: { Function: {}, Other: {} },
            Public: { Function: {}, Other: {} },
            Abstract: {},
            Static: { Function: {}, Other: {} }
        };
    }

    _(descriptor).each(function eachProperty(value, key) {
        prefix = key.charAt(0);
        if (/^init(ialize)?$/.test(key)) {   // IF TRUE: init function
            if (hasInit) {   // IF TRUE: There is already an init function stored in the result object
                throw new Error('Found two init methods "' + key + '" and "' + result.Init + '".');
            } else if (isMethod(value) === false) {    // IF TRUE: the init property is not a function
                throw new Error('The init method "' + key + '" is not a function.');
            }
            hasInit = true;
            result.Init = key;
        } else if (prefix === '?') { // IF TRUE: abstract property
            if (typeof value !== 'function') {
                throw new Error('You can only define abstract functions.\n' +
                    'However, the abstract property "' + key + '" is typeof ' + typeof value + '.');
            }
            result.Abstract[key] = value;
        } else if (prefix === '$') { // IF TRUE: static property
            if (isMethod(value)) {
                result.Static.Function[key] = value;
            } else {
                result.Static.Other[key] = value;
            }
        } else if (prefix !== '_') { // IF TRUE: public property
            if (key === "Extends" || key === "Super") {
                return; // break
            }
            if (isMethod(value)) {
                result.Public.Function[key] = value;
            } else {
                result.Public.Other[key] = value;
            }
        } else {    // IF TRUE: private or protected property
            prefix = key.charAt(1); // now we're looking at the second character
            if (prefix === '_') {    // IF TRUE: private property
                if (isMethod(value)) {
                    result.Private.Function[key] = value;
                } else {
                    result.Private.Other[key] = value;
                }
            } else {    // IF TRUE: protected property
                if (isMethod(value)) {
                    result.Protected.Function[key] = value;
                } else {
                    result.Protected.Other[key] = value;
                }
            }
        }
    });

    return result;
}



/**
 * <p>Collects all super properties into one result. Works recursive, so if
 * the current class module provides an Extends-property, all properties of this
 * super class are collected first. Thus super properties are overridden by
 * properties of the current module.</p>

 * @param {Object} descriptor class module
 * @returns {Object} result
 */
function collectSuperProperties(descriptor) {
    var result,
        superDescriptor;

    if (descriptor.Extends) {    // IF TRUE: this class has a super class. so we're collecting these properties first.
        superDescriptor = registry.getEntry(descriptor.Extends).descriptor;
        result = collectSuperProperties(superDescriptor);
        result = collectProperties(descriptor, result);
    } else {
        result = collectProperties(descriptor);
    }

    return result;
}



/**
 * <p>Compares the public and protected properties of the current class with
 * the public and protected properties inherited by all super classes and saves
 * all properties, that have the the same name. These properties will be ignored
 * when all super properties are exposed since they are overriden by the
 * current class.</p>

 * @param {Object} This all collected properties from the current class
 * @param {Object} Super all collected properties from the super classes
 * @param {Object} [result={}] the object where the result is stored in
 * @returns {Object} result all properties, that have been overridden by the current class
 */
function collectOverriddenProperties(This, Super, result) {
    if(!result) {
        result = {};
    }

    _(This.Public.Function).each(function eachPublicFunction(value, key) {
        if(Super.Public.Function[key]) {
            result[key] = true;
        }
    });
    _(This.Public.Other).each(function eachPublicOther(value, key) {
        if(Super.Public.Other[key]) {
            result[key] = true;
        }
    });
    _(This.Protected.Function).each(function eachProtectedFunction(value, key) {
        if(Super.Protected.Function[key]) {
            result[key] = true;
        }
    });
    _(This.Protected.Other).each(function eachProtectedOther(value, key) {
        if(Super.Protected.Other[key]) {
            result[key] = true;
        }
    });

    return result;
}



/**
 * Searches for abstract methods in the given super class and compares them
 * to the child class. Returns an object with all former abstract method names
 * as keys
 *
 * The object is empty if there have no items been found.

 * @param {Object} Class the class descriptor
 * @param {Array} abstractMethods an array with all inherited abstract methods (all names with the "?"-prefix)
 * @returns {Object} result all implemented abstract method names
 * @throws an error if an inherited abstract is not implemented nor declared as abstract
 */
function collectImplAbstracts(Class, abstractMethods) {
    var implAbstracts = {},
        unhandledAbstracts = [];

    _(abstractMethods).each(function eachAbstracts(methodName) {
        if(Class.hasOwnProperty(methodName)) {
            // this method is declared as abstract, so it has been handled

            return; // continue
        }
        methodName = methodName.substr(1); // trimming the prefix

        if(Class.hasOwnProperty(methodName)) {
            implAbstracts[methodName] = true;

            return; // continue
        }
        unhandledAbstracts.push(methodName);
    });
    if(unhandledAbstracts.length > 0) {
        throw new Error('(nodeclass) You didnt take care of the inherited abstract function(s) "?' + unhandledAbstracts.join('", "?') + '".\n'
            + 'Declare them as abstract or implement them without the "?"-prefix.');
    }

    return implAbstracts;
}

exports.collectSuperProperties = collectSuperProperties;
exports.collectOverriddenProperties = collectOverriddenProperties;
exports.collectImplAbstracts = collectImplAbstracts;
exports.collectProperties = collectProperties;