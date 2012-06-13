"use strict"; // run code in ES5 strict mode

var metaclass = require("metaclass"),
    ClassError = require("../classes/ClassError.class.js"),

    MetaAttribute = metaclass.Attribute,
    MetaVisibility = metaclass.Visibility;

function buildMetaAttribute(propName, propValue, valueIs, detectionResult) {
    var metaAttribute,
        visibility;

    if (detectionResult.isAbstract) {
        throw new ClassError("Error while building meta attribute '" + propName + "': " +
            "Abstract properties are not supported.");
    }
    if (detectionResult.isStatic === true && detectionResult.isPublic === false) {
        throw new ClassError("Error while building meta attribute '" + propName + "': " +
            "Static properties must be public.");
    }

    metaAttribute = new MetaAttribute();
    metaAttribute.setName(detectionResult.propertyName);
    if (valueIs.existent()) {
        if (valueIs.instanceOf(Function)) {
            metaAttribute.setType(propValue);
            metaAttribute.setInitialValue(null);
        } else {
            metaAttribute.setType(propValue.constructor);
            metaAttribute.setInitialValue(propValue);
        }
    } else {
        metaAttribute.setType(undefined);
        metaAttribute.setInitialValue(null);
    }

    if (detectionResult.isPublic) {
        visibility = MetaVisibility.PUBLIC;
    } else if (detectionResult.isProtected) {
        visibility = MetaVisibility.PROTECTED;
    } else {
        visibility = MetaVisibility.PRIVATE;
    }
    metaAttribute.setVisibility(visibility);
    metaAttribute.setStatic(detectionResult.isStatic);

    return metaAttribute;
}

module.exports = buildMetaAttribute;