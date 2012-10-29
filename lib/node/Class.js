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

    logger.log("info", "Compiling " + className + " ");

    if (typeof className !== "string") {
        throw new TypeError("(nodeclass) Cannot create Class: You haven't pass a class name.");
    }
    if (typeof descriptor !== "object") {
        throw new TypeError("(nodeclass) Cannot create Class: Class descriptor object missing.");
    }

    registryEntry = registry.getEntry(descriptor);

    // Shortcuts if the descriptor is already in the registry
    if (registryEntry) {
        logger.log("info", "✔ Compiled class is already in registry\n");
        constructor = registryEntry.constructorFunc;
        if (constructor) {
            return constructor;
        }
        compiledSrc = registryEntry.compiledSrc;
        if (compiledSrc) {
            constructor = executeCompiledSrc(compiledSrc, descriptor);
            registry.setEntry(descriptor, constructor, compiledSrc);
            return constructor;
        }
    }

    start = new Date();

    compiledSrc = build(descriptor, className);

    logger.log("verbose", "... executing compiled source ");

    constructor = executeCompiledSrc(compiledSrc, descriptor);
    registry.setEntry(descriptor, constructor, compiledSrc);

    logger.log("info", "✔ done (" + (new Date().getTime() - start.getTime()) + "ms)\n");

    return constructor;
}

function executeCompiledSrc(compiledSrc, descriptor) {
    var targetModule = {
            exports: descriptor
        },
        filename;

    try {
        // This is a nasty trick to get the filename of the Class
        throw new Error();
    } catch (err) {
        filename = err.stack
            .split("\n")[3]
            .match(/\((.*)\)/)[1]
            .replace(/:[0-9]+:[0-9]+$/g, "");
    }

    vm.runInNewContext(compiledSrc, {
        module: targetModule,
        console: console,
        require: require
    }, filename + " [COMPILED] ");

    return targetModule.exports;
}

module.exports = Class;