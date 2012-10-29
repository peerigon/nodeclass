"use strict";

var _ = require("underscore"), 
    analyze = require("./analyze.js"),
    generate = require("./generate.js"),
    registry = require("./registry.js"),
    ClassMap = require("./ClassMap.js"),
    PropertyMap = require("./PropertyMap.js"),
    checkIdentifier = require("./helpers/checkIdentifier.js"),
    logger = require("../logger.js");

function build(descriptor, className) {
    var classMap = new ClassMap(),
        Extends,
        superDescriptor,
        src;

    if (typeof descriptor !== "object") {
        throw new TypeError("(nodeclass) The descriptor is not an object: Instead saw typeof '" + typeof descriptor + "'");
    }
    if (typeof className === "string") {
        checkIdentifier(className, "Class name");
        classMap.className = className;
    }

    // Collecting all properties of this class and all inherited properties
    logger.log("verbose", "... analyzing ");
    analyze.analyzeDescriptor(descriptor, classMap);
    Extends = descriptor.Extends;

    if (typeof Extends === "function") {
        // Retrieve super descriptor from registry
        superDescriptor = registry.getEntry(Extends).descriptor;
    } else if (typeof Extends === "string") {
        // If Extends is a string, we're interpreting it as an absolute path
        superDescriptor = require(Extends);
    }

    if (typeof superDescriptor === "object") {
        classMap.superProperties = new PropertyMap();

        // Collect all inherited properties from the inheritance graph
        analyze.analyzeSuperDescriptor(superDescriptor, classMap);

        // We don't need the private methods and attributes of the SuperClass
        delete classMap.superProperties.private;

        // Compare thisProperties with superProperties and sort out all overridden properties
        analyze.collectOverriddenMethods(classMap);
    }

    // Assemble the strings
    logger.log("verbose", "... generating code ");
    src = generate.generateCode(classMap);

    return src;
}

module.exports = build;