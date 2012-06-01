"use strict"; // run code in ES5 strict mode

var ClassError = require("./ClassError.class");

var knownDescriptors = [],
    builtMetaInterfaces = [],
    builtInterfaces = [];

// todo write class

function Interface(interfaceDescriptor) {

}

Interface.getMetaInterface = function (interfaceInstance) {
    var indexOf = builtInterfaces.indexOf(interfaceInstance),
        metaInterface = builtMetaInterfaces[indexOf];

    if (metaInterface) {
        return metaInterface;
    } else {
        throw new ClassError("Error while retrieving meta interface: The given interface instance is unknown");
    }
};

module.exports = Interface;