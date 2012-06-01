"use strict";

var Package = require("nodeclass").Package;

module.exports = new Package({
    compileOptions: {
        srcPath: __dirname,
        verbose: true
    },
    exports: [
        "example/Cat.class.js"
    ]
});