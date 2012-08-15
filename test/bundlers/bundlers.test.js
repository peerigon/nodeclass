"use strict"; // run code in ES5 strict mode

var b = require("browserify")({ debug: true }),
    webpack = require("webpack"),
    fs = require("fs"),
    pathUtil = require("path"),
    nodeclass = require("../../lib/index.js"),
    context = require("path").resolve(__dirname, "../../");

var entryFilename = pathUtil.resolve(__dirname, "../simpleTest/simpleTest.test.js");

b.use(nodeclass.bundlers.browserify);
b.addEntry(entryFilename);
fs.writeFileSync(__dirname + "/browserifyBundle.js", b.bundle(), "utf8");

webpack(entryFilename, {
    context: context,
    output: __dirname + "/webpackBundle.js",
    debug: true,
    includeFilenames: true,
    preLoaders: [
        nodeclass.bundlers.webpack
    ]
}, function onWebpackFinished(err, stats) {
    if (err) throw err;
});