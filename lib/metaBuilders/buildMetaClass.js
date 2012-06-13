"use strict"; // run code in ES5 strict mode

var Class = require("../classes/Class.class"), // circular dependency, but it should be no problem here
    ClassError = require("../classes/ClassError.class.js"),
    Interface = require("../classes/Interface.class"),
    metaclass = require("metaclass"),
    buildMetaMethod = require("./buildMetaMethod.js"),
    buildMetaAttribute = require("./buildMetaAttribute.js"),
    buildMetaConstructor = require("./buildMetaConstructor"),
    PropertyDetection = require("../classes/PropertyDetection.class.js"),
    logger = require("../helpers/logger.js"),

    MetaClass = metaclass.Class,
    is = metaclass.helpers.is,
    detect = PropertyDetection.detect,
    isEach = metaclass.helpers.isEach;

function buildMetaClass(classDescriptor) {
    var key,
        value,
        valueIs,
        detectionResult,
        metaClass = new MetaClass(),

        // caching boolean results to speed up the checking
        hasConstructor = false,
        hasSuperClass = false,
        hasInterfaces = false;

    logger.info("Building meta class ...");
    // looping properties of class descriptor
    for (key in classDescriptor) {
        if (classDescriptor.hasOwnProperty(key)) {
            logger.info("Reading property '" + key + "' ...");

            value = classDescriptor[key];
            valueIs = is(value);
            detectionResult = detect(key, value);
            logger.info("Detection result: ");
            logger.info(detectionResult);

            // Detecting constructor
            if (detectionResult.isConstructor) {
                logger.info("Treating property '" + key + "' as a constructor ...");

                // checking for errors
                if (hasConstructor) {
                    throw new ClassError("The class has two constructors. You can only define one.");
                }

                // setting constructor
                metaClass.setConstructor(buildMetaConstructor(key, value, valueIs, detectionResult));
                hasConstructor = true;
                continue;   // shortcut
            }

            // Detecting super class
            if (detectionResult.isSuperClass) {
                logger.info("Treating property '" + key + "' as super class declaration ...");

                // checking for errors
                if (hasSuperClass) {
                    throw new ClassError("The class has two super class declarations. You can only define one.");
                }
                if (valueIs.notInstanceOf(Class)) {
                    throw new TypeError("Error while collecting inheritance information: " +
                        "I've assumed that the property named '" + key + "' declares the super class, " +
                        "but the value is not an instance of Class as I'd expect.");
                }

                // setting super class
                metaClass.setSuperClass(Class.getMetaClass(value));
                hasSuperClass = true;
                continue;
            }

            // Detecting interfaces
            if (detectionResult.isInterfaces) {
                logger.info("Treating property '" + key + "' as interfaces declaration ...");
                logger.warn("Interfaces are not supported yet");
                /*

                // checking for errors
                if (hasInterfaces) {
                    throw new ClassError("The class has two interface declarations. You can only define one.");
                }
                if (valueIs.notInstanceOf(Array)) {
                    throw new TypeError("Error while collecting interface information: " +
                        "I've assumed that the property named '" + key + "' declares all implemented interfaces, " +
                        "but the value is not an array as I'd expect.");
                }
                if (isEach(value).instanceOf(Interface) === false) {
                    value.forEach(function eachInterface(item, index) { // get index for a nice error message
                        if (is(item).notInstanceOf(Interface)) {
                            throw new TypeError("Error while collecting interface information: " +
                                "I've assumed that the property named '" + key + "' declares all implemented interfaces, " +
                                "but the array contains an item at index " + index + " that is not an instance of Interface.");
                        }
                    });
                }

                // setting interfaces


                hasInterfaces = true;
                continue; */
            }

            // Property creation
            if (detectionResult.isMethod) {
                logger.info("Treating property '" + key + "' as a method ...");
                metaClass.addProperty(buildMetaMethod(key, value, valueIs, detectionResult));
            } else {
                logger.info("Treating property '" + key + "' as an attribute ...");
                metaClass.addProperty(buildMetaAttribute(key, value, valueIs, detectionResult));
            }
        }
    }

    return metaClass;
}

function isAMethod() {

}

module.exports = buildMetaClass;