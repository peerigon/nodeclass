var indexWeb = require("./main.web.js"),
    _ = require("underscore"),
    key;

// Nodejs only
// Putting require in brackets disables the require sniffing from browserify
if (typeof window === "undefined") {
    exports.compile = (require)("./compile.js");
    exports.compileModule = (require)("./compileModule.js");
    exports.registerExtension = (require)("./registerExtension.js");
    exports.bundlers = (require)("./bundlers/index.js");
}

// Forward all index.web properties to this index.js
_(exports).extend(indexWeb);