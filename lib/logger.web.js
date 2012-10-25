"use strict"; // run code in ES5 strict mode

var loggers = {
    /**
     * @param {String} txt
     * @param {Boolean=false} headline
     */
    console: function (txt, headline) {
        console.log(txt);
    },

    /**
     * @param {String} txt
     */
    muted: function (txt) { }
};

exports.info = loggers.console;

exports.loggers = loggers;