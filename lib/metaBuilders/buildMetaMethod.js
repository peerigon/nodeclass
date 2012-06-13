"use strict"; // run code in ES5 strict mode

var metaclass = require("metaclass"),
    ClassError = require("../classes/ClassError.class.js"),

    MetaMethod = metaclass.Method,
    MetaAbstractMethod = metaclass.AbstractMethod,
    MetaVisibility = metaclass.Visibility;

function buildMetaMethod(propName, propValue, valueIs, detectionResult) {
    var metaMethod,
        visibility;

    if (detectionResult.isStatic === true && detectionResult.isPublic === false) {
        throw new ClassError("Error while building meta method '" + propName + "': " +
            "Static properties must be public.");
    }

    if (detectionResult.isAbstract) {
        metaMethod = new MetaAbstractMethod();
    } else {
        metaMethod = new MetaMethod();
        metaMethod.setFunction(propValue);
    }

    metaMethod.setName(detectionResult.propertyName);

    if (detectionResult.isPublic) {
        visibility = MetaVisibility.PUBLIC;
    } else if (detectionResult.isProtected) {
        visibility = MetaVisibility.PROTECTED;
    } else {
        visibility = MetaVisibility.PRIVATE;
    }
    metaMethod.setVisibility(visibility);
    metaMethod.setStatic(detectionResult.isStatic);

    // someday we will add params here to enable strong-typed classes (as provided by the meta class)

    return metaMethod;
}

module.exports = buildMetaMethod;