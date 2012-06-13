"use strict"; // run code in ES5 strict mode

var MetaMethod = require("metaclass").Method,
    MetaVisibility = require("metaclass").Visibility,
    isNodeClassConstructor = require("../helpers/isNodeClassConstructor.js"),
    ClassError = require("../classes/ClassError.class.js");

function buildMetaConstructor(propName, propValue, valueIs, detectionResult) {
    var constructor,
        visibility;

    // Error checking
    if (detectionResult.isAttribute || propValue === Function) {
        throw new TypeError("Error while building meta constructor '" + propName + "': " +
            "The class constructor must be an ordinary function");
    }
    if (detectionResult.isStatic) {
        throw new ClassError("Error while building meta constructor '" + propName + "': " +
            "Static constructors are not supported");
    }
    if (detectionResult.isAbstract) {
        throw new ClassError("Error while building meta constructor '" + propName + "': " +
            "Abstract constructors are not supported");
    }

    if (detectionResult.isPublic) {
        visibility = MetaVisibility.PUBLIC;
    } else if (detectionResult.isProtected) {
        visibility = MetaVisibility.PROTECTED;
    } else {
        visibility = MetaVisibility.PRIVATE;
    }

    constructor = new MetaMethod();
    constructor
        .setName(detectionResult.propertyName)
        .setVisibility(visibility);
    constructor.setFunction(propValue);

    return constructor;
}

module.exports = buildMetaConstructor;