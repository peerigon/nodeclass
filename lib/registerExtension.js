"use strict"; // run code in ES5 strict mode

var build = require("./build.js"),
    vm = require("vm");

var nodeExtensionHandler,
    knownConstructors = [],
    knownDescriptors = [],
    knownFilenames = [];

function extensionHandler(module, filename) {
    var src,
        descriptor,
        superDescriptor,
        superConstructor,
        index,
        hasSuperClass;

    nodeExtensionHandler(module, filename);

    if (/\.class\.js$/.test(filename) && typeof module.exports !== "function") {
        index = knownFilenames.indexOf(filename);
        if (index === -1) {
            index = knownFilenames.length;
        }

        descriptor = module.exports;
        if (descriptor.Extends) {
            hasSuperClass = true;
            superConstructor = descriptor.Extends;
            superDescriptor = knownDescriptors[knownConstructors.indexOf(superConstructor)];
            descriptor.Extends = superDescriptor;
        }

        try {
            src = build(descriptor);
        } catch (err) {
            err.message = "(nodeclass) Error while building class '" + filename + "':\n\n" + err.message;

            throw err;
        }


        if (hasSuperClass) {
            descriptor.Extends = superConstructor;
        }

        vm.runInNewContext(src, {module: module}, filename);

        if (hasSuperClass) {
            descriptor.Extends = superDescriptor;
        }

        knownFilenames.splice(index, 1, filename);
        knownConstructors.splice(index, 1, module.exports);
        knownDescriptors.splice(index, 1, descriptor);
    }
}
extensionHandler.nodeclass = true;

function registerExtension() {
    var currentExtHandler = require.extensions[".js"];

    if (currentExtHandler.nodeclass !== true) {
        nodeExtensionHandler = currentExtHandler;
        require.extensions[".js"] = extensionHandler;
    }
}

module.exports = registerExtension;