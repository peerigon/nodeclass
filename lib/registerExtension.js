"use strict"; // run code in ES5 strict mode

var fs = require("fs"),
    build = require("./build.js"),
    vm = require("vm");

var nodeExtensionHandler = require.extensions[".js"],
    knownConstructors = [],
    knownDescriptors = [],
    knownFilenames = [];

// Taken from https://github.com/joyent/node/blob/master/lib/module.js
function stripBOM(content) {
    // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
    // because the buffer-to-string conversion in `fs.readFileSync()`
    // translates it to FEFF, the UTF-16 BOM.
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
}

function extensionHandler(module, filename) {
    var src,
        descriptor,
        superDescriptor,
        superConstructor,
        index,
        hasSuperClass;

    if (/\.class\.js$/i.test(filename) && typeof module.exports !== "function") {
        src = stripBOM(fs.readFileSync(filename, "utf8"));
        module._compile(src, filename);

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
            src += "\n\n\n" + build(descriptor);
        } catch (err) {
            err.message = "(nodeclass) Error while building class '" + filename + "':\n\n" + err.message;

            throw err;
        }

        if (hasSuperClass) {
            descriptor.Extends = superConstructor;
        }

        //vm.runInNewContext(src, {module: module}, filename);
        module._compile(src, filename);

        if (hasSuperClass) {
            descriptor.Extends = superDescriptor;
        }

        knownFilenames.splice(index, 1, filename);
        knownConstructors.splice(index, 1, module.exports);
        knownDescriptors.splice(index, 1, descriptor);
    } else {
        nodeExtensionHandler(module, filename);
    }
}
extensionHandler.nodeclass = true;
extensionHandler.nodeExtensionHandler = nodeExtensionHandler;

function registerExtension() {
    var currentExtHandler = require.extensions[".js"];

    if (currentExtHandler.nodeclass !== true) {
        extensionHandler.nodeExtensionHandler = nodeExtensionHandler = currentExtHandler;
        require.extensions[".js"] = extensionHandler;
    }
}

module.exports = registerExtension;