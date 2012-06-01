"use strict"; // run code in ES5 strict mode

var Class = require("../../lib").Class;

var MySuperClass = new Class({
    init: function () {
        console.log("MySuperClass");
    },
    sayHello: function () {
        console.log("Hello from MySuperClass");
        this.myAbstract();
    },
    "?myAbstract": Function
});

module.exports = MySuperClass;