"use strict"; // run code in ES5 strict mode

var is = require("metaclass/lib/helpers/is.js");

var filenames = [],
    descriptors = [],
    constructors = [];

function setEntry(filename, descriptor, constructor) {
    var index = filenames.indexOf(filename);

    filenames.splice(index, 1, filename);
    constructors.splice(index, 1, constructor);
    descriptors.splice(index, 1, descriptor);
}

function getEntry(component) {
    var index,
        isComponent = is(component);

    if (isComponent.instanceOf(Function)) {
        index = constructors.indexOf(component);
    } else if (isComponent.instanceOf(Object)) {
        index = descriptors.indexOf(component);
    } else if (isComponent.instanceOf(String)) {
        index = filenames.indexOf(component);
    } else {
        throw new TypeError("(nodeclass) Cannot get registry entry: The component must be a Function, Object or String");
    }

    if (index === -1) {
        return null;
    } else {
        return {
            filename: filenames[index],
            descriptor: descriptors[index],
            constructor: constructors[index]
        };
    }
}

exports.setEntry = setEntry;
exports.getEntry = getEntry;
