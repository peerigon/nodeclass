"use strict"; // run code in ES5 strict mode

var b = require("browserify")({ debug: true }),
    webpack = require("webpack"),
    fs = require("fs"),
    pathUtil = require("path"),
    nodeclass = require("../../lib/index.js");

var entryFilename = pathUtil.resolve(__dirname, "../simpleTest/simpleTest.test.js");

nodeclass.registerExtension();  // this could cause an error, so we're testing

b.use(nodeclass.bundlers.browserify);
b.addEntry(entryFilename);
fs.writeFileSync(__dirname + "/browserifyBundle.js", b.bundle(), "utf8");

webpack(entryFilename, {
    output: __dirname + "/webpackBundle.js",
    //debug: true,
    resolve: {
        loaders: [
            nodeclass.bundlers.webpack
        ]
    }
}, function onWebpackFinished(err, stats) {
    if (err) throw err;
});