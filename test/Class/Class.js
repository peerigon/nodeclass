"use strict"; // run code in ES5 strict mode

var MyClass = require("./MyClass.class.js");

var myClass = new MyClass();

myClass.setSomeNumber(3);
console.log(myClass.getSomeNumber());
myClass.sayHello();