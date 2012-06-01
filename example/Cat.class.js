"use strict";

var Class = require("../package.json");

var Cat = new Class({
    /**
     * @type {String}
     */
    name: "Garfield",
    /**
     * @type {Number}
     */
    age: Number,
    /**
     * @constructor
     * @param {String} name
     * @param {Number} age
     */
    _construct: function (name, age) {
        Class.checkParams(name, String, age, Number);
        this.name = name;
        this.age = age;
    },
    /**
     * @param {Number} numberOfLegs
     */
    _getGreeting: function (numberOfLegs) {
        Class.checkParams(numberOfLegs, Number);
        return "Hello, my name is " + this.name + " and I have " + numberOfLegs + " legs";
    }
});



module.exports = Cat;