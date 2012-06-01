"use strict"; // run code in ES5 strict mode

var buildMetaClass = require("./../metaBuilders/buildMetaClass");

var knownDescriptors = [],
    builtMetaClasses = [],
    builtClasses = [];

function Class(classDescriptor) {
    var indexOfDescriptor = knownDescriptors.indexOf(classDescriptor),
        builtMetaClass,
        builtClass;

    if (indexOfDescriptor === -1) {
        builtMetaClass = buildMetaClass(classDescriptor);
    } else {
        builtClass = builtClasses[indexOfDescriptor];
    }

    return builtClass;
}

Class.getMetaClass = function (classConstructor) {
    var indexOf = builtClasses.indexOf(classConstructor),
        metaClass = builtMetaClasses[indexOf];

    return metaClass || null;
};

module.exports = Class;