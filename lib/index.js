// Nodejs only
// Putting require in brackets disables the require sniffing from browserify
if (typeof window === "undefined") {
    exports.compile = (require)("./compile");
    exports.registerExtension = (require)("./registerExtension.js");
    exports.browser = (require)("./browser.js");
}

exports.is = require("metaclass/lib/helpers/is.js");
exports.isEach = require("metaclass/lib/helpers/is.js");
exports.Class = function (Class) {
    return Class;
};
// Used for logging output. You can override this for other logging options.
exports.stdout = function (txt) {
    console.log(txt);
};