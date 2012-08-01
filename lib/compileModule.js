"use strict"; // run code in ES5 strict mode

var fs = require("fs"),
    build = require("./build.js"),
    nodeExtensionHandler = require.extensions[".js"];

function compileModule(filename, src) {
    var currentExtHandler = require.extensions[".js"],
        cached,
        Class;

    if (currentExtHandler !== nodeExtensionHandler) {
        require.extensions[".js"] = nodeExtensionHandler;
    }

    cached = require.cache[filename];
    delete require.cache[filename];
    Class = require(filename);
    if (cached) {
        require.cache[filename] = cached;   // restore cached module
    }

    if (!src) {
        src = fs.readFileSync(filename, "utf8");
    }

    if (typeof Class === "object") {
        src += "\n\n\n" + build(Class, filename);
    }

    if (currentExtHandler.nodeclass === true) {
        require.extensions[".js"] = currentExtHandler;  // restore previous extension handler
    }

    return src;
}

module.exports = compileModule;