"use strict"; // run code in ES5 strict mode

var fs = require("fs"),
    build = require("./build.js"),
    registry = require("./registry.js");

function compileModule(filename, src) {
    var cached,
        constructor;

    //console.log("\n\n\n\n" + filename);

    cached = require.cache[filename];
    delete require.cache[filename];
    constructor = require(filename);
    if (cached) {
        require.cache[filename] = cached;   // restore cached module
    }

    if (!src) {
        src = fs.readFileSync(filename, "utf8");
    }

    //console.log(constructor.name, registry.getEntry(constructor));

    src += "\n\n\n" + registry.getEntry(constructor).compiledSrc;

    return src;
}

module.exports = compileModule;