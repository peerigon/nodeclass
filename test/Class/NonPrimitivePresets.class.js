"use strict"; // run code in ES5 strict mode

var Class = require("../../lib/index.js").Class;

var NonPrimitivePresets = new Class("NonPrimitivePresets", {
    arrProp: [],
    objProp: {}
});

module.exports = NonPrimitivePresets;