"use strict"; // run code in ES5 strict mode

var buildMetaClass = require("./../metaBuilders/buildMetaClass"),
    logger = require("../helpers/logger.js");

var knownDescriptors = [],
    builtMetaClasses = [],
    builtClasses = [];

function Class(classDescriptor) {
    var indexOfDescriptor,
        builtMetaClass,
        builtClass;

    logger.info("Class constructor called ...");
    indexOfDescriptor = knownDescriptors.indexOf(classDescriptor);
    if (indexOfDescriptor === -1) {
        builtMetaClass = buildMetaClass(classDescriptor);
    } else {
        logger.info("Existing meta class found. Returning existing instance ...");
        builtClass = builtClasses[indexOfDescriptor];
    }



    logger.info("Class constructor end");

    return builtClass;
}

Class.getMetaClass = function (classConstructor) {
    var indexOf = builtClasses.indexOf(classConstructor),
        metaClass = builtMetaClasses[indexOf];

    return metaClass || null;
};

module.exports = Class;