"use strict";

exports.is = require("metaclass/lib/helpers/is.js");
exports.isEach = require("metaclass/lib/helpers/is.js");
// Used for logging output. You can override this for other logging options.
exports.stdout = function (txt) {
    console.log(txt);
};
exports.Class = require("./web/Class.web.js");

if (typeof window === "undefined") {
    exports.compileModule = require("./node/compileModule.js");
    exports.bundlers = require("./bundlers/index.js");
    exports.Class = require("./node/Class.js");
}