"use strict"; // run code in ES5 strict mode

var MetaMethod = require("metaclass").Method,
    MetaVisibility = require("metaclass").Visibility;

function buildMetaConstructor(propName, propValue, valueIs, detectionResult) {
    var constructor,
        visibility;

    if (valueIs.notInstanceOf(Function)) {
        throw new TypeError("The constructor must be a function");
    }
    if (valueIs.nativeConstructor()) {
        throw new TypeError("The constructor must not be a native constructor function");
    }

    if (detectionResult.isPublic) {
        visibility = MetaVisibility.PUBLIC;
    } else if (detectionResult.isProtected) {
        visibility = MetaVisibility.PROTECTED;
    } else {
        visibility = MetaVisibility.PRIVATE;
    }

    constructor = new MetaMethod();
    constructor
        .setName(detectionResult.constructorName)
        .setVisibility(visibility);
    constructor.setFunction(propValue);

    return constructor;
}

module.exports = buildMetaConstructor;