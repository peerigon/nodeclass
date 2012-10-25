"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var Presets = new Class("Presets", {
    $nullProp: null,
    $numberProp: 2,
    $stringProp: "hello",
    $arrProp: [],
    $objProp: {},
    nullProp: null,
    numberProp: 2,
    stringProp: "hello",
    _nullProp: null,
    _numberProp: 2,
    _stringProp: "hello",
    __nullProp: null,
    __numberProp: 2,
    __stringProp: "hello",
    exposeThis: function () {
        return this;
    }
});

module.exports = Presets;