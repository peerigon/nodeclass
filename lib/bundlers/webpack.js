"use strict"; // run code in ES5 strict mode

var compileModule = require("../node/compileModule.js");

function webpackLoader(src) {
    var splitted = this.request.split("!"),
        filename = splitted[splitted.length - 1];

    this.cacheable && this.cacheable(); // mark it as cacheable

    src = compileModule(filename, src);

    return src;
}

webpackLoader.loader = __filename;
webpackLoader.test = /\.class\.js$/i;

module.exports = webpackLoader;