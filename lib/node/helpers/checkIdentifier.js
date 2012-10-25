"use strict"; // run code in ES5 strict mode

/**
 * @private
 * @param {String} identifier
 * @param {String} identifierName
 * @throws {SyntaxError}
 */
function checkIdentifier(identifier, identifierName) {
    if (/[ \?\."'\+\-,;!]/.test(identifier)) {
        throw new SyntaxError("(nodeclass) " + identifierName + " '" + identifier + "' contains illegal characters.");
    }
}

module.exports = checkIdentifier;