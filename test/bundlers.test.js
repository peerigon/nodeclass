"use strict"; // run code in ES5 strict mode

var webpack = require("webpack"),
    nodeclass = require("../lib/index.js"),
    context = require("path").resolve(__dirname, "../../");

var entryFilename = __dirname + "/Class.web.test.js";

describe("bundlers", function () {
    describe("webpack", function () {
        it("should output a bundle without errors", function (done) {
            webpack(entryFilename, {
                context: context,
                output: __dirname + "/bundlers/webpack/bundle.js",
                debug: true,
                includeFilenames: true,
                preLoaders: [
                    nodeclass.bundlers.webpack
                ]
            }, function onWebpackFinished(err, stats) {
                if (err) throw err;
                if (stats.errors.length > 0) throw stats.errors[0];
                done();
            });
        });
    });
});
