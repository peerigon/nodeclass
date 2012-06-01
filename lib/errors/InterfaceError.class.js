"use strict"; // run code in ES5 strict mode

/**
 * @class ClassError
 * @extends js.Error
 * @param {js.String} msg Human-readable description of the error
 */
function InterfaceError(msg) {
    this.name = "InterfaceError";
    this.msg = msg;
}

// TODO write errors

InterfaceError.prototype = new Error();

module.exports = InterfaceError;