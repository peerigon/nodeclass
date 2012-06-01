"use strict"; // run code in ES5 strict mode

/**
 * @class ClassError
 * @extends js.Error
 * @param {js.String} msg Human-readable description of the error
 */
function ClassError(msg) {
    this.name = "ClassError";
    this.msg = msg;
}

ClassError.prototype = new Error();

module.exports = ClassError;