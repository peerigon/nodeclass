"use strict";

exports.is = require("metaclass/lib/helpers/is.js");
exports.isEach = require("metaclass/lib/helpers/is.js");
exports.Class = require("./web/Class.web.js");

exports.logger = require("./logger.js");

if (typeof window === "undefined") {
    exports.compileModule = require("./node/compileModule.js");
    exports.bundlers = require("./bundlers/index.js");
    exports.Class = require("./node/Class.js");
}