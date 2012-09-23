"use strict"; // run code in ES5 strict mode

var descriptors = [],
    constructors = [],
    compiledSources = [];

function setEntry(descriptor, constructor, compiledSrc) {
    var index = descriptors.indexOf(descriptor);

    if (index === -1) {
        index = descriptors.length;
    }

    constructors.splice(index, 1, constructor);
    descriptors.splice(index, 1, descriptor);
    compiledSources.splice(index, 1, compiledSrc);
}

function getEntry(component) {
    var index;

    if (typeof component === "function") {
        index = constructors.indexOf(component);
    } else if (typeof component === "object") {
        index = descriptors.indexOf(component);
    } else {
        throw new TypeError("(nodeclass) Cannot get registry entry: The component must be a Function or an Object");
    }

    if (index === -1) {
        return null;
    } else {
        return {
            descriptor: descriptors[index],
            constructorFunc: constructors[index],
            compiledSrc: compiledSources[index]
        };
    }
}

exports.setEntry = setEntry;
exports.getEntry = getEntry;
