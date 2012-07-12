"use strict"; // run code in ES5 strict mode

var compileModule = require("../compileModule.js");

function webpackLoader() {
    var splitted = this.request.split("!"),
        filename = splitted[splitted.length - 1];

    return compileModule(filename);
}

webpackLoader.loader = __filename;
webpackLoader.test = /\.class\.js$/i;

module.exports = webpackLoader;