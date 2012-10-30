"use strict"; // run code in ES5 strict mode

var clc = require("cli-color");

var loggers = {
    /**
     * txt starting with "#" becomes a headline
     * txt starting with "✔" becomes green
     * txt starting with "..." becomes grey
     * characters enclosed with brackets become grey
     *
     * @param {String} txt
     */
    console: function (txt) {
        if (/^#/.test(txt)) {
            txt = clc.underline(txt);
        } else if (/^✔/.test(txt)) {
            txt = clc.greenBright(txt);
        } else if (/^\.\.\./.test(txt)) {
            txt = clc.blackBright(txt);
        }
        txt = txt.replace(/\((.*?)\)/g, clc.blackBright("($1)"));
        process.stdout.write(txt);
    },

    /**
     * @param {String} txt
     */
    mute: function (txt) { }
};

var levels = {
    info: loggers.console,
    verbose: loggers.mute
};

exports.use = function (level, loggerType) {
    var logger = loggers[loggerType];

    if (typeof logger !== "function") {
        throw new TypeError("(nodeclass) Cannot use logger: Unknown loggerType '" + loggerType + "'");
    }

    levels[level] = loggers[loggerType];
};

exports.log = function (level, arg1, arg2) {
    levels[level](arg1, arg2);
};