"use strict"; // run code in ES5 strict mode

var compileModule = require("./../node/compileModule.js"),
    pathUtil = require("path"),
    nodeDir = pathUtil.resolve(__dirname, "../node");

function browserifyMiddleware(b) {
    b.register(".js", function (src, filename) {
        if (filename.indexOf(__dirname) !== -1 || filename.indexOf(nodeDir) !== -1) {
            return ""; // exclude node-only files
        }

        if (/\.class\.js$/i.test(filename)) {
            src = compileModule(filename, src);
        }

        return src;
    });
}

module.exports = browserifyMiddleware;