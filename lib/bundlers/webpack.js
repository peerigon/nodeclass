"use strict"; // run code in ES5 strict mode

var compileModule = require("../node/compileModule.js"),
    pathUtil = require("path");

function webpackLoader() {
    var splitted = this.request.split("!"),
        filename = splitted[splitted.length - 1],
        className = pathUtil.basename(filename),
        src;

    className = className.replace(/\..*$/, ""); // remove possible postfixes

    src = compileModule(filename);

    src += "\n" +
        "if (typeof " + className + ' === "object") {\n' +
        "    " + className + " = module.exports;\n" +
        "}";

    return src;
}

webpackLoader.loader = __filename;
webpackLoader.test = /\.class\.js$/i;

module.exports = webpackLoader;