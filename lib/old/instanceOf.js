"use strict";

function instanceOf(Class) {
    return this.Class === Class ||
        (
            this.Super !== undefined &&
            this.Super.instanceOf(Class)
        );
}

module.exports = instanceOf;