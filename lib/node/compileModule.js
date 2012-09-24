"use strict"; // run code in ES5 strict mode

var fs = require("fs"),
    vm = require("vm"),
    BuildingState = require("./BuildingState.js"),
    build = require("./build.js"),
    registry = require("./registry.js"),
    pathUtil = require("path");

function compileModule(filename, src) {
    var previousBuildingMode,
        constructor,
        cached;

    previousBuildingMode = BuildingState.mode;
    BuildingState.mode = "compile";

    cached = require.cache[filename];
    delete require.cache[filename];
    constructor = require(filename);
    if (cached) {
        require.cache[filename] = cached;   // restore cached module
    }

    if (!src) {
        src = fs.readFileSync(filename, "utf8");
    }

    if (typeof constructor !== "function") {
        throw new Error("(nodeclass) Class '" + filename + "' doesn't export itself.");
    } else {
        src += "\n\n\n" + registry.getEntry(constructor).compiledSrc;
    }

    BuildingState.mode = previousBuildingMode;

    return src;
}

module.exports = compileModule;