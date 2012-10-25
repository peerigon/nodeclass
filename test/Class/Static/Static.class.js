"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var Static = new Class("Static", {
    Extends: require("../Visibility/SimpleClass.class.js"),
    $undefinedProp: undefined,
    $nullProp: null,
    $booleanProp: false,
    $numberProp: 2,
    $stringProp: "hello",
    $arrProp: [],
    $objProp: {},
    $exposeThis: function () {
        return this;
    }
});

module.exports = Static;