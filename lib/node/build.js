"use strict";

var _ = require("underscore"), 
    collect = require("./collect"),
    assembleStrings = require("./assembleStrings"),
    registry = require("./registry.js");

/**
 * Builds a constructor function from a class descriptor. The result is
 * returned as a string containing JavaScript-code, so it can be evaled inside
 * of the class module.
 *
 * The constructor function wrappes a Properties-object, being a copy
 * of the original Class-object. Functions from the Class-object are not copied
 * but bound with the Properties-object as this-reference, so every operation
 * in a function is done on the current Properties-object.
 *
 * Additionally the constructor function provides access to all public
 * members by default. To expose protected members as well, every constructor
 * function reads the Constructor.$-object and constructs the new object
 * as instructed by the given flags. For instance: If $.exposeProtected is true,
 * the constructor provides access to all protected members, so a child-class
 * can use them, too. These flags are used:
 *
 *    - implChildAbstracts: an array that contains references to all abstract
 *    functions that are implemented in a child class
 *    - exposeProtected: if true, the constructor function exposes all
 *    protected class members.
 *
 * @private
 * @param {Object} descriptor the class descriptor
 * @param {String} className the class name for debugging purposes
 * @throws {TypeError}
 * @throws {Error}
 * @return {String} source
 */
function build(descriptor, className) {
    var thisProperties,
        superProperties,
        Extends,
        superDescriptor,
        src,
        abstractMethodNames,
        superImplementedAbstracts;

    if (typeof descriptor !== "object") {
        throw new TypeError("(nodeclass) The descriptor is not an object: Instead saw typeof '" + typeof descriptor + "'");
    }
    if (typeof className === "string") {
        if (/[ \."'\+\-,;!]/.test(className)) {
            throw new Error("(nodeclass) Class name contains illegal characters: Only characters A-Za-z0-9 are allowed.");
        }
    } else {
        className = "Constructor";
    }

    // Collecting all properties of this class and all inherited properties
    thisProperties = collect.collectProperties(descriptor);
    Extends = descriptor.Extends;

    // If Extends is a string, we're interpreting it as an absolute path
    if (typeof Extends === "string") {
        Extends = require(Extends);
    } else if (typeof Extends === "function") {
        // Retrieve super descriptor from registry
        Extends = registry.getEntry(Extends).descriptor;
    }

    if (typeof Extends === "object") {
        // Retrieve super descriptor from registry
        superDescriptor = Extends;

        // Collect all inherited properties from the inheritance graph
        superProperties = collect.collectSuperProperties(superDescriptor);

        // Compare thisProperties with superProperties and sort out all overridden properties
        thisProperties.Overridden = collect.collectOverriddenProperties(thisProperties, superProperties);

        // Collect all names of abstract methods from the super classes
        abstractMethodNames = _(superProperties.Abstract).keys();

        // Determine all abstract methods that have been implemented by super classes
        superProperties.ImplementedAbstracts = collect.collectImplAbstracts(superDescriptor,abstractMethodNames);

        // Filter all abstract methods that have been implemented by super classes
        superImplementedAbstracts = _(superProperties.ImplementedAbstracts).keys();
        abstractMethodNames = abstractMethodNames.filter(function (methodName) {
            return superImplementedAbstracts.indexOf(methodName.substr(1)) === -1;
        });

        // Determine all abstract methods that have been implemented by this class
        thisProperties.ImplementedAbstracts = collect.collectImplAbstracts(descriptor, abstractMethodNames);
    }

    // Assemble the strings
    src = assembleStrings(thisProperties, className, superProperties);

    return src;
}

module.exports = build;