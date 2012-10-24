"use strict"; // run code in ES5 strict mode

var _ = require("underscore"),
    fs = require("fs");

var _code = _.template(fs.readFileSync("../../templates/Code.ejs"), "utf8");

function generateCode(classMap) {
    return _code({
        $classMap: classMap,
        $thisProperties: classMap.properties,
        $superProperties: classMap.superProperties
    });
}

exports.generateCode = generateCode;