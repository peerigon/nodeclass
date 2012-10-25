"use strict"; // run code in ES5 strict mode

var _ = require("underscore");

var nativeTypes = [Boolean, Number, String, Array, Object, RegExp, Date];

/**
 * @private
 * @param {*} value
 * @return {Boolean}
 */
function isMethod(value) {
    return typeof value === "function" && _(nativeTypes).indexOf(value) === -1;
}

module.exports = isMethod;