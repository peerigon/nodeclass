"use strict"; // run code in ES5 strict mode

var fs = require("fs"),
    build = require("./build.js"),
    nodeExtensionHandler = require.extensions[".js"];

function compileModule(filename, src) {
    var currentExtHandler = require.extensions[".js"],
        Class;

    if (currentExtHandler !== nodeExtensionHandler) {
        require.extensions[".js"] = nodeExtensionHandler;
    }

    Class = require(filename);

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