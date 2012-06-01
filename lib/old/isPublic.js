"use strict";

/**
 * Returns true if the property fulfills the requirements of a public property.
 *
 * @private
 * @param {js.String} key
 * @param {js.Object} value
 * @return {js.Boolean}
 */
var isPublic = function (key, value) {
    return key.charAt(0) !== "_" && value instanceof Function;
};

module.exports = isPublic;