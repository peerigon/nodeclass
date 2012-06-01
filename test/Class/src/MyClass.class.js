"use strict"; // run code in ES5 strict mode

var MySuperClass = require("./MySuperClass.class.js");

var MyClass = {
    Extends: MySuperClass,
    init: function () {
        console.log("MyClass");
    },
    someNumber: 2,
    sayHello: function () {
        console.log("Hello from MyClass");
        this.Super.sayHello();
    },
    myAbstract: function () {
        console.log("This function isn't abstract anymore");
    }
};

module.exports = MyClass;