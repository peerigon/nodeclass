// Putting require in brackets disables the require sniffing from browserify
exports.compile = (require)("./compile");
exports.is = require("metaclass").helpers.is;
exports.isEach = require("metaclass").helpers.isEach;
exports.Class = function (Class) {
    return Class;
};
exports.registerExtension = (require)("./registerExtension.js");
// Used for logging output. You can override this for other logging options.
exports.stdout = function (txt) {
    console.log(txt);
};