"use strict"; // run code in ES5 strict mode

var clc = require("cli-color");

var loggers = {
    /**
     * @param {String} txt
     * @param {Boolean=false} headline
     */
    console: function (txt, headline) {
        if (headline) {
            console.log(clc.underline(txt));
        } else {
            console.log(clc.green(txt));
        }
    },

    /**
     * @param {String} txt
     */
    muted: function (txt) { }
};

exports.info = loggers.console;

exports.loggers = loggers;