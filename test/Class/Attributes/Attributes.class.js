"use strict"; // run code in ES5 strict mode

var Class = require("../../../lib/index.js").Class,
    expect = require("expect.js");

var Attributes = new Class("Attributes", {
    init: function () {
        expect(this.Instance).to.be.an(Attributes);
        expect(this.Instance.Class).to.be(Attributes);
    },
    $nullProp: null,
    $booleanProp: false,
    $numberProp: 2,
    $stringProp: "hello",
    $arrProp: [],
    $objProp: {},
    nullProp: null,
    booleanProp: false,
    numberProp: 2,
    stringProp: "hello",
    _nullProp: null,
    _booleanProp: false,
    _numberProp: 2,
    _stringProp: "hello",
    __nullProp: null,
    __booleanProp: false,
    __numberProp: 2,
    __stringProp: "hello",
    exposeThis: function () {
        return this;
    }
});

module.exports = Attributes;