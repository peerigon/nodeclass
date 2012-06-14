exports.compile = require('./compile');
exports.is = require("metaclass").helpers.is;
exports.isEach = require("metaclass").helpers.isEach;
exports.Class = function (Class) {
    return Class;
};