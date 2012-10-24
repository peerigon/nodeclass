"use strict";

var _ = require("underscore"), 
    collect = require("./collect.js"),
    generate = require("./generate.js"),
    registry = require("./registry.js"),
    ClassMap = require("./ClassMap.js");

function build(descriptor, className) {
    var classMap = new ClassMap(),
        Extends,
        superDescriptor,
        src;

    if (typeof descriptor !== "object") {
        throw new TypeError("(nodeclass) The descriptor is not an object: Instead saw typeof '" + typeof descriptor + "'");
    }
    if (typeof className === "string") {
        if (/[ \."'\+\-,;!]/.test(className)) {
            throw new Error("(nodeclass) Class name contains illegal characters: Only characters A-Za-z0-9 are allowed.");
        }
        classMap.className = className;
    }

    // Collecting all properties of this class and all inherited properties
    collect.collectProperties(descriptor, classMap.properties);
    Extends = descriptor.Extends;

    if (typeof Extends === "function") {
        // Retrieve super descriptor from registry
        superDescriptor = registry.getEntry(Extends).descriptor;
    } else if (typeof Extends === "string") {
        // If Extends is a string, we're interpreting it as an absolute path
        superDescriptor = require(Extends);
    }

    if (typeof superDescriptor === "object") {
        // Collect all inherited properties from the inheritance graph
        collect.collectSuperProperties(superDescriptor, classMap.superProperties);

        // Compare thisProperties with superProperties and sort out all overridden properties
        //TODO
    }

    // Assemble the strings
    src = generate(classMap);

    return src;
}

module.exports = build;