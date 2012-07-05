"use strict"; // run code in ES5 strict mode

var vm = require("vm"),
    pathUtil = require("path"),
    build = require("./build.js"),
    fs = require("fs");

var bindSrc = fs.readFileSync(pathUtil.resolve(__dirname, "../lib/shims/bind.js"), "utf8");


function getSandboxRequire(filename) {
    var dirname = pathUtil.dirname(filename);

    return function sandboxRequire(path) {
        var resolvedPath;

        if (path.charAt(0) === ".") {
            path =  pathUtil.resolve(dirname, path);
        }

        resolvedPath = require.resolve(path);

        return require(resolvedPath);
    };
}

function getSandbox(filename) {
    var sandbox = {
        console: console,
        exports: {},
        module: {},
        require: getSandboxRequire(filename)
    };

    sandbox.module.exports = sandbox.exports;

    return sandbox;
}

function compileModule(src, filename) {
    var sandbox = getSandbox(filename);

    vm.runInNewContext(src, sandbox, filename);

    return sandbox.module.exports;
}

function browserifyMiddleware(b) {
    b.register(".js", function (src, filename) {
        var currentExtHandler,
            Class;

        if (/\.class\.js$/i.test(filename)) {
            currentExtHandler = require.extensions[".js"];

            if (currentExtHandler.nodeclass === true) {
                require.extensions[".js"] = currentExtHandler.nodeExtensionHandler;
            }

            require(filename);

            Class = compileModule(src, filename);

            if (typeof Class === "object") {
                src += "\n\n\n" + build(Class, filename);
            }

            if (currentExtHandler.nodeclass === true) {
                require.extensions[".js"] = currentExtHandler;  // restore previous extension handler
            }
        }

        return src;
    });

    b.prepend(bindSrc);
}

exports.browserify = browserifyMiddleware;