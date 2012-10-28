"use strict"; // run code in ES5 strict mode

var _ = require("underscore"),
    fs = require("fs"),
    nameModifiers = require("./helpers/nameModifiers.js");

var _code = _.template(fs.readFileSync(__dirname + "/../../templates/code.ejs", "utf8")),
    _setter = _.template(fs.readFileSync(__dirname + "/../../templates/setter.ejs", "utf8")),
    _getter = _.template(fs.readFileSync(__dirname + "/../../templates/getter.ejs", "utf8")),
    _publicExports = _.template(fs.readFileSync(__dirname + "/../../templates/publicExports.ejs", "utf8")),
    _staticExports = _.template(fs.readFileSync(__dirname + "/../../templates/staticExports.ejs", "utf8")),
    _protectedExports = _.template(fs.readFileSync(__dirname + "/../../templates/protectedExports.ejs", "utf8")),
    _methodBindings = _.template(fs.readFileSync(__dirname + "/../../templates/methodBindings.ejs", "utf8"));

function generateCode(classMap) {
    return _code({
        $classMap: classMap,
        $thisProperties: classMap.properties,
        $superProperties: classMap.superProperties,
        $nameModifiers: nameModifiers,
        $generate: {
            publicExports: publicExports,
            protectedExports: protectedExports,
            staticExports: staticExports,
            methodBindings: methodBindings
        }
    });//.replace(/\s+/g, " ");
}

function setter(key) {
    return _setter({
        key: key
    });
}

function getter(key) {
    return _getter({
        key: key
    });
}

function publicExports(classMap) {
    return _publicExports({
        $classMap: classMap,
        $thisProperties: classMap.properties,
        $superProperties: classMap.superProperties,
        $nameModifiers: nameModifiers,
        $generate: {
            setter: setter,
            getter: getter
        }
    });
}

function protectedExports(classMap) {
    return _protectedExports({
        $classMap: classMap,
        $thisProperties: classMap.properties,
        $superProperties: classMap.superProperties,
        $nameModifiers: nameModifiers,
        $generate: {
            setter: setter,
            getter: getter
        }
    });
}

function staticExports(classMap) {
    return _staticExports({
        $classMap: classMap,
        $thisProperties: classMap.properties,
        $nameModifiers: nameModifiers
    });
}

function methodBindings(classMap) {
    return _methodBindings({
        $thisProperties: classMap.properties
    });
}

exports.generateCode = generateCode;