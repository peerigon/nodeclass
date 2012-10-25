"use strict"; // run code in ES5 strict mode

var registry = require("./registry.js"),
    build = require("./build.js"),
    vm = require("vm"),
    logger = require("../logger.js");

/**
 * Takes a descriptor object and builds a constructor function with class-features like inheritance,
 * private and public scopes, abstract and static properties.
 *
 * @param {String} className Unique class name. Needed for a prettier stack trace.
 * @param {Object} descriptor
 * @throws {TypeError} when an argument is missing
 * @constructor
 */
function Class(className, descriptor) {
    var compiledSrc,
        registryEntry,
        constructor,
        start;

    logger.log("info", "\nCompiling class " + className, true);

    if (typeof className !== "string") {
        throw new TypeError("(nodeclass) Cannot create Class: You haven't pass a class name.");
    }
    if (typeof descriptor !== "object") {
        throw new TypeError("(nodeclass) Cannot create Class: Class descriptor object missing.");
    }

    registryEntry = registry.getEntry(descriptor);

    // Shortcuts if the descriptor is already in the registry
    if (registryEntry) {
        logger.log("info", "Compiled class is already in registry. Taking shortcut ...");
        constructor = registryEntry.constructorFunc;
        if (constructor) {
            return constructor;
        }
        compiledSrc = registryEntry.compiledSrc;
        if (compiledSrc) {
            constructor = executeCompiledSrc(compiledSrc, descriptor, className);
            registry.setEntry(descriptor, constructor, compiledSrc);
            return constructor;
        }
    }

    start = new Date();

    compiledSrc = build(descriptor, className);

    logger.log("info", "Executing compiled source ...");
    constructor = executeCompiledSrc(compiledSrc, descriptor, className);
    registry.setEntry(descriptor, constructor, compiledSrc);

    logger.log("info", "Compilation of " + className + " took " + (new Date().getTime() - start.getTime()) + "ms");

    return constructor;
}

function executeCompiledSrc(compiledSrc, descriptor, className) {
    var targetModule = {
            exports: descriptor
        };

    vm.runInNewContext(compiledSrc, {
        module: targetModule,
        console: console
    }, "Compiled source @ " + className);

    return targetModule.exports;
}

module.exports = Class;