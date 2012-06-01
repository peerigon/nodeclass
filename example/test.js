"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function A(bla) {
    EventEmitter.call(this);
    this.a = "a";
}

util.inherits(A, EventEmitter);

function B() {
    A.call(this);
    this.b = "b";
}

console.log(A.toString());