"use strict"; // run code in ES5 strict mode

var assert = require("expect.js");

function expect() {
    return assert.apply(null, arguments);
}

expect.numOfTests = 0;
expect.actualNumOfTests = 0;
expect.done = function (callback) {
    var numOfTests = expect.numOfTests,
        actualNumOfTests = expect.actualNumOfTests;

    if (numOfTests !== actualNumOfTests) {
        throw new Error("Seems like you've missed some assertions. You've expected " +
            numOfTests + " but executed only " + actualNumOfTests);
    }
    // resetting
    expect.numOfTests = 0;
    expect.actualNumOfTests = 0;

    if (callback) {
        callback();
    }
};

module.exports = expect;