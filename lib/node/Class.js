"use strict"; // run code in ES5 strict mode

var BuildingState = require("./BuildingState.js"),
    registry = require("./registry.js"),
    build = require("./build.js"),
    vm = require("vm");

/**
 * Takes a descriptor object and builds a constructor function with class-features like inheritance,
 * private and public scopes, abstract and static properties.
 *
 * @param {String} className Unique class name. Needed for a prettier stack trace.
 * @param {Object} descriptor
 * @throw {TypeError} when an argument is missing
 * @constructor
 */
function Class(className, descriptor) {
    var compiledSrc,
        registryEntry,
        constructor;

    if (typeof className !== "string") {
        throw new TypeError("(nodeclass) Cannot create Class: You haven't pass a class name.");
    }
    if (typeof descriptor !== "object") {
        throw new TypeError("(nodeclass) Cannot create Class: Class descriptor object missing.");
    }

    registryEntry = registry.getEntry(descriptor);

    // Shortcuts if the descriptor is already in the registry
    if (registryEntry) {
        compiledSrc = registryEntry.compiledSrc;
        constructor = registryEntry.constructorFunc;
        if (constructor) {
            return constructor;
        }
        if (compiledSrc) {
            constructor = executeCompiledSrc(compiledSrc, descriptor, className);
            registry.setEntry(descriptor, constructor, compiledSrc);
            return constructor;
        }
    }

    compiledSrc = build(descriptor, className);

    constructor = executeCompiledSrc(compiledSrc, descriptor, className);
    registry.setEntry(descriptor, constructor, compiledSrc);

    return constructor;
}

function executeCompiledSrc(compiledSrc, descriptor, className) {
    var targetModule = {
            exports: descriptor
        };

    vm.runInNewContext(compiledSrc, {
        module: targetModule
    }, "compiled source of " + className);

    return targetModule.exports;
}

module.exports = Class;