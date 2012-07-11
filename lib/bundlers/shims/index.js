"use strict"; // run code in ES5 strict mode

var fs = require("fs");

exports.bind = fs.readFileSync(__dirname + "/bind.js", "utf8");