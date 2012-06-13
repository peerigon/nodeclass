"use strict"; // run code in ES5 strict mode

/**
 * Returns true if a function is a constructor that has been created
 * by nodeclass.
 *
 * @param {!Function} fn
 * @return {Boolean}
 */
function isNodeClassConstructor(fn) {
    var flagObj;

    if (typeof fn === "function") {
        flagObj = fn["@"];
        return typeof flagObj === "object" && flagObj.nodeClass === true;
    } else {
        return false;
    }
}

module.exports = isNodeClassConstructor;