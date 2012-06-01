"use strict";

var Class = require("../package.json").Class,
    Greetable = require("./Greetable.interface"),
    Cat = require("./Cat.class");

var OctoCat = new Class({
    Extends: Cat,
    Implements: [Greetable],
    /**
     * @type {String}
     */
    name: "Octocat",
    /**
     * @constructor
     * @param {String} name
     * @param {Number} age
     */
    construct: function (name, age) {
        Class.checkParams(arguments, [Cat, Number]);
        this.__seekParents();
    },
    /**
     * @private
     */
    __seekParents: function () {
        this.someAbstractMethod();
    },
    /**
     * @abstract
     * @param {String} param1
     * @param {Number} param2
     */
    "?someAbstractMethod": function (param1, param2) {}
});
