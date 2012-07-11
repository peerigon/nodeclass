"use strict"; // run code in ES5 strict mode

var compileModule = require("./../compileModule.js"),
    bindSrc = require("./shims").bind;

function browserifyMiddleware(b) {
    b.register(".js", function (src, filename) {
        if (/\.class\.js$/i.test(filename)) {
            src = compileModule(filename, src);
        }

        return src;
    });

    b.prepend(bindSrc);
}

module.exports = browserifyMiddleware;