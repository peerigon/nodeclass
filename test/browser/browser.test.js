"use strict"; // run code in ES5 strict mode

var b = require("browserify")({debug: true}),
    fs = require("fs"),
    pathUtil = require("path"),
    nodeclass = require("../../lib/index.js");

nodeclass.registerExtension();  // this could cause an error, so we're testing

b.use(require("../../lib/browser.js").browserify);
b.addEntry(pathUtil.resolve(__dirname, "../simpleTest/simpleTest.test.js"));
fs.writeFileSync(__dirname + "/bundle.js", b.bundle(), "utf8");