"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class;

var SettersOverridden = new Class("SettersOverridden", {
    myNumber1: 2,
    _myNumber2: 2,
    __myNumber3: 2,
    setMyNumber1: function (value) { },
    setMyNumber2: function (value) { },
    setMyNumber3: function (value) { },
    // for testing purposes
    getNumbers: function () {
        return [this.myNumber1, this._myNumber2, this.__myNumber3];
    }
});

module.exports = SettersOverridden;