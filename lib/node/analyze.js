"use strict";

var _ = require("underscore"),
    registry = require("./registry.js"),
    checkIdentifier = require("./helpers/checkIdentifier.js"),
    checkAttributeType = require("./helpers/checkAttributeType.js"),
    isMethod = require("./helpers/isMethod.js"),
    ClassMap = require("./ClassMap.js");

/**
 * @param {Object} descriptor
 * @param {ClassMap} classMap
 */
function analyzeDescriptor(descriptor, classMap) {
    var prefix,
        properties = classMap.properties;

    _(descriptor).each(function collectProperty(value, key) {
        prefix = key.charAt(0);
        checkIdentifier(key, "Property name");
        if (prefix === "_") {
            prefix = key.charAt(1); // now we're looking at the second character
            if (prefix === "_") {    // IF TRUE: private property
                if (isMethod(value)) {
                    properties.private.method[key] = value;
                } else {
                    checkAttributeType(key, value);
                    properties.private.attribute[key] = value;
                }
            } else {    // IF TRUE: protected property
                if (isMethod(value)) {
                    properties.protected.method[key] = value;
                } else {
                    checkAttributeType(key, value);
                    properties.protected.attribute[key] = value;
                }
            }
        } else if (prefix === "$") { // IF TRUE: static property
            if (isMethod(value)) {
                properties.static.method[key] = value;
            } else {
                properties.static.attribute[key] = value;
            }
        } else { // IF TRUE: public property
            if (key === "Extends" || key === "Super") {
                return; // break
            }
            if (key === "init") {
                if (isMethod(value) === false) {    // IF TRUE: the init property is not a function
                    throw new TypeError('The init method "' + key + '" is not a function.');
                }
                classMap.hasInit = true;
            } else if (isMethod(value)) {
                properties.public.method[key] = value;
            } else {
                checkAttributeType(key, value);
                properties.public.attribute[key] = value;
            }
        }
    });
}

/**
 * @param {Object} descriptor
 * @param {ClassMap} classMap
 */
function analyzeSuperDescriptor(descriptor, classMap) {
    var superDescriptor,
        superClassMap = new ClassMap();

    if (descriptor.Extends) {    // IF TRUE: this class has a super class. so we're collecting these properties first.
        superDescriptor = registry.getEntry(descriptor.Extends).descriptor;
        analyzeSuperDescriptor(superDescriptor, classMap);
    }
    superClassMap.properties = classMap.superProperties;
    analyzeDescriptor(descriptor, superClassMap);
}

/**
 * @param {ClassMap} classMap
 */
function collectOverriddenMethods(classMap) {
    var overriddenMethods = classMap.overriddenMethods,
        thisProperties = classMap.properties,
        superProperties = classMap.superProperties;

    _(thisProperties.public.method).each(function checkOverridden(value, key) {
        if (superProperties.public.method[key]) {
            overriddenMethods[key] = value;
        }
    });
    _(thisProperties.protected.method).each(function checkOverridden(value, key) {
        if (superProperties.protected.method[key]) {
            overriddenMethods[key] = value;
        }
    });
}


exports.analyzeDescriptor = analyzeDescriptor;
exports.analyzeSuperDescriptor = analyzeSuperDescriptor;
exports.collectOverriddenMethods = collectOverriddenMethods;