"use strict"; // run code in ES5 strict mode

function Class(className, descriptor) {
    if (typeof className === "object") {
        descriptor = className;
    }

    return descriptor;
}

module.exports = Class;