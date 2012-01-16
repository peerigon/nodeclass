"use strict"; // run code in ES5 strict mode

var Mammal = (function () {
    /**
    * This is a class pattern
    *
    * @class Mammal
    * @param {js.String} name the mammal's name
    */
    function Mammal(name) {
        var This = this;
        this.Public = {};

        return This.Public;
    }

    return Object.freeze(function Constructor() {
        return Object.freeze(new Mammal());
    });
}());

var Dog = (function () {
    /**
    * This is a class pattern
    *
    * @class Dog
    * @extends animals.Mammal
    * @param {js.String} name the dog's name
    */
    function Dog(name) {
        var This = this;
        this.Public = {};
        this.Super = this.constructor.prototype;

        return This.Public;
    }

    return Object.freeze(function Constructor() {
        Dog.prototype = new Mammal();
        return Object.freeze(new Dog());
    });
}());