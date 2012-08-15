"use strict"; // run code in ES5 strict mode

var registry = require("./registry.js"),
    build = require("./build.js"),
    vm = require("vm");

function Class(className, descriptor) {
    var compiledSrc,
        targetModule,
        constructor;

    if (typeof className === "object") {
        descriptor = className;
        className = "Constructor";
    }

    constructor = registry.getEntry(descriptor);

    // Shortcut if the descriptor is already in the registry
    if (constructor) {
        return constructor;
    }

    compiledSrc = build(descriptor, className);

    targetModule = {
        exports: descriptor
    };
    vm.runInNewContext(compiledSrc, {
        module: targetModule
    }, "compiled source @ " + className);
    constructor = targetModule.exports;

    registry.setEntry(descriptor, constructor, compiledSrc);

    return constructor;
}

module.exports = Class;