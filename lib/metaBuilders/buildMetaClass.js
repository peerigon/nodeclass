"use strict"; // run code in ES5 strict mode

var Class = require("../classes/Class.class"), // circular dependency, but it should be no problem here
    Interface = require("../classes/Interface.class"),
    metaclass = require("metaclass"),
    buildMetaAttribute = require("./buildMetaAttribute.js"),
    buildMetaConstructor = require("./buildMetaConstructor"),
    PropertyNameDetection = require("../classes/PropertyNameDetection.class.js"),
    MetaClass = metaclass.Class,
    is = metaclass.helpers.is,
    isEach = metaclass.helpers.isEach;

function buildMetaClass(classDescriptor) {
    var key,
        propertyName,   // clean name without prefixes
        value,
        valueIs,
        detectionResult,
        metaClass = new MetaClass(),
        // caching boolean results to speed up the checking
        hasConstructor = false,
        hasSuperClass = false,
        hasInterfaces = false,
        // caching references for faster access within the loop
        _buildMetaAttribute = buildMetaAttribute,
        _buildMetaConstructor = buildMetaConstructor,
        _detectConstructor = PropertyNameDetection.detectConstructor,
        _detectPrefixes = PropertyNameDetection.detectPrefixes,
        _detectSuperClass = PropertyNameDetection.detectSuperClass,
        _detectInterfaces = PropertyNameDetection.detectInterfaces;

    for (key in classDescriptor) {
        if (classDescriptor.hasOwnProperty(key)) {
            value = classDescriptor[key];
            valueIs = is(value);

            // Constructor-Check
            if (hasConstructor === false) {
                detectionResult = _detectConstructor(key, value);
                if (detectionResult.isConstructor) {
                    metaClass.setConstructor(
                        _buildMetaConstructor(key, value, valueIs, detectionResult)
                    );
                    hasConstructor = true;
                    continue;
                }
            }

            detectionResult = _detectPrefixes(key, value);
            propertyName = detectionResult.propertyName;

            // Superclass-Check
            if (hasSuperClass === false) {
                if (_detectSuperClass(key, value)) {
                    if (valueIs.notInstanceOf(Class)) {
                        throw new TypeError("Error while collecting inheritance information: " +
                            "I've assumed that the property named '" + key + "' declares the super class, " +
                            "but the value is not an instance of Class as I'd expect.");
                    }
                    metaClass.setSuperClass(
                        Class.getMetaClass(value)
                    );
                    hasSuperClass = true;
                }
            }

            // Interfaces-Check
            if (hasInterfaces === false) {
                if (_detectInterfaces(key, value)) {
                    if (valueIs.notInstanceOf(Array)) {
                        throw new TypeError("Error while collecting interface information: " +
                            "I've assumed that the property named '" + key + "' declares all implemented interfaces, " +
                            "but the value is not an array as I'd expect.");
                    }
                    if (isEach(value).instanceOf(Interface) === false) {
                        value.forEach(function eachInterface(item, index) { // get index for a nice error message
                            if (is(item).instanceOf(Interface) === false) {
                                throw new TypeError("Error while collecting interface information: " +
                                    "I've assumed that the property named '" + key + "' declares all implemented interfaces, " +
                                    "but the array contains an item at index " + index + " that is not an instance of Interface.");
                            }
                        });
                    }

                    hasInterfaces = true;
                }
            }

            // Property creation
            if (valueIs.instanceOf(Function) && valueIs.notNativeConstructor())
            metaClass.addProperty(_buildMetaAttribute(key, value, valueIs));
        }
    }

    return metaClass;
}

module.exports = buildMetaClass;