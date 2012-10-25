"use strict"; // run code in ES5 strict mode

var clc = require("cli-color");

var loggers = {
    /**
     * @param {String} txt
     * @param {Boolean=false} headline
     */
    "console": function (txt, headline) {
        if (headline) {
            console.log(clc.underline(txt));
        } else {
            console.log(clc.green(txt));
        }
    },

    /**
     * @param {String} txt
     */
    "no logger": function (txt) { }
};

var levels = {
    info: loggers.console
};

exports.use = function (level, loggerType) {
    var logger = loggers[loggerType];

    if (typeof logger !== "function") {
        throw new TypeError("(nodeclass) Cannot use logger: Unknown loggerType '" + loggerType + "'");
    }

    levels[level] = loggers[loggerType];
};

exports.get = function (level) {
    return levels[level];
};

exports.log = function (level, arg1, arg2) {
    levels[level](arg1, arg2);
};