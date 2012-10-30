"use strict"; // run code in ES5 strict mode

var fs = require("fs"),
    registry = require("./registry.js");

function compileModule(filename, src) {
    var constructor,
        cached;

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

    return src;
}

module.exports = compileModule;