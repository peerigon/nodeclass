"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var A = new Class("A", {
    "?implementThis": Function,
    callAbstractMethod: function () {
        return this.implementThis();
    }
});

module.exports = A;