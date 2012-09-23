"use strict"; // run code in ES5 strict mode

var fs = require("fs"),
    vm = require("vm"),
    BuildingState = require("./BuildingState.js"),
    build = require("./build.js"),
    registry = require("./registry.js"),
    pathUtil = require("path"),

    pathToIndexModule = pathUtil.resolve(__dirname, "../index.js");

function compileModule(filename, src) {
    var previousBuildingMode;

    previousBuildingMode = BuildingState.mode;
    BuildingState.mode = "compile";

    if (!src) {
        src = fs.readFileSync(filename, "utf8");
    }

    src = runInSandbox(filename, src);

    BuildingState.mode = previousBuildingMode;

    return src;
}

function runInSandbox(filename, src) {
    var dirname = pathUtil.dirname(filename),
        sandbox = {
            require: function (path) {
                if (path.charAt(0) === ".") {
                    path = pathUtil.resolve(dirname, path);

                    if (path === pathToIndexModule) {
                        return require("../index.js")
                    } else {
                        return path;
                    }
                } else if (path === "nodeclass") {
                    return require("../index.js");
                } else {
                    return path;
                }
            },
            module: {},
            console: console
        };

    vm.runInNewContext(src, sandbox, filename);
    if (typeof sandbox.module.exports !== "object") {
        throw new Error("(nodeclass) Class '" + filename + "' doesn't export itself.");
    } else {
        src += "\n\n\n" + registry.getEntry(sandbox.module.exports).compiledSrc;
    }

    return src;
}

module.exports = compileModule;