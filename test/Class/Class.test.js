"use strict"; // run code in ES5 strict mode

var compile = require("../../lib/index.js").compile;


compile(__dirname + "/src", __dirname + "/compiled");

var MyClass = require("./compiled/MyClass.class.js");

var myClass = new MyClass();

myClass.setSomeNumber(3);
console.log(myClass.getSomeNumber());
myClass.sayHello();