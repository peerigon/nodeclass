"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var GettersOverridden = new Class("GettersOverridden", {
    myNumber1: 2,
    _myNumber2: 2,
    __myNumber3: 2,
    getMyNumber1: function () { return 3; },
    getMyNumber2: function () { return 3; },
    getMyNumber3: function () { return 3; }
});

module.exports = GettersOverridden;