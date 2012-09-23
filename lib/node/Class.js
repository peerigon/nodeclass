"use strict"; // run code in ES5 strict mode

var BuildingState = require("./BuildingState.js"),
    registry = require("./registry.js"),
    build = require("./build.js"),
    vm = require("vm");

/**
 * Takes a descriptor object and builds a constructor function with class-features like inheritance,
 * private and public scopes, abstract and static properties.
 *
 * @param {String=} className Unique class name. Needed for a prettier stack trace.
 * @param {Object} descriptor
 * @return {Function|Object} Returns the constructor function in "runtime"-mode. Returns just the descriptor in "compile"-mode
 * @constructor
 */
function Class(className, descriptor) {
    var compiledSrc,
        registryEntry,
        constructor;

    // Switch arguments if the class name is missing
    if (typeof className === "object") {
        descriptor = className;
        className = "Constructor";
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

    if (BuildingState.mode === "runtime") {
        constructor = executeCompiledSrc(compiledSrc, descriptor, className);
        registry.setEntry(descriptor, constructor, compiledSrc);

        return constructor;
    } else {
        registry.setEntry(descriptor, null, compiledSrc);

        return descriptor;
    }
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