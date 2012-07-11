"use strict"; // run code in ES5 strict mode

var compileModule = require("../compileModule.js");

function webpackLoader() {
    var filename = this.request.split("!")[1];

    return compileModule(filename);
}

webpackLoader.loader = __filename;
webpackLoader.test = /\.class\.js$/i;

module.exports = webpackLoader;