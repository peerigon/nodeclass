"use strict"; // run code in ES5 strict mode

var Interface = require("../package.json").Interface;

var Greetable = new Interface({
    /**
     * @param {String}
     * @returns {String}
     */
    greet: Interface.Method({
        params: [String],
        returns: String
    })
});

