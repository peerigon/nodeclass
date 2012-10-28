"use strict"; // run code in ES5 strict mode

var _ = require("underscore"),
    path = require("path"),
    logger = require("../../lib/logger.js"),
    fs = require("fs"),
    util = require("util"),
    clc = require("cli-color");

var outputDir = __dirname + "/results",
    numOfIterations = 20000,
    outputFile = outputDir + "/" +
        new Date()
        .toUTCString()
        .replace(/,/g, "")
        .replace(/:/g, "-")
        .replace("GMT", " " + numOfIterations) +
        ".json",
    nodeClassPath = "./C.class.js",
    classicPath = "./C.js",
    Class,
    result = {
        setup: {
            numOfIterations: numOfIterations,
            nodeClassPath: nodeClassPath,
            classicPath: classicPath,
            unit: "milliseconds"
        },
        tests: {
            nodeclass: {},
            classic: {}
        }
    };

var operations = {
    compilation: function compilation(path) {
        delete require.cache[path];
        require(path);
    },
    instantiation: function instantiation(Class) {
        new Class();
    },
    execution: function execution(instance) {
        instance.getClassNames();
    }
};

function perform(action, arg) {
    var start,
        duration,
        i,
        progress = 0,
        previousProgress = 0;

    process.stdout.write(clc.blackBright(action.name + clc.move(20 - action.name.length, 0) + " ["));

    start = new Date().getTime();
    for (i = 0; i < numOfIterations; i++) {
        action(arg);
        progress = Math.floor((i / numOfIterations) * 50);
        if (progress !== previousProgress) {
            process.stdout.write(clc.blackBright("="));
        }
        previousProgress = progress;
    }
    duration = new Date().getTime() - start;

    process.stdout.write(clc.blackBright("] ") + clc.greenBright(duration + "ms") + "\n");

    return duration;
}

logger.use("info", "mute");

// NODECLASS
console.log("\n" + clc.underline("nodeclass"));
result.tests.nodeclass.compilation = perform(operations.compilation, nodeClassPath);
Class = require(nodeClassPath);
result.tests.nodeclass.instantiation = perform(operations.instantiation, Class);
result.tests.nodeclass.execution = perform(operations.execution, new Class());

// CLASSIC
console.log("\n" + clc.underline("classic"));
result.tests.classic.compilation = perform(operations.compilation, classicPath);
Class = require(classicPath);
result.tests.classic.instantiation = perform(operations.instantiation, Class);
result.tests.classic.execution = perform(operations.execution, new Class());

// PRINT SETUP
console.log("\n" + clc.blackBright("-------------------------------------------------------------------------------"));
console.log("\nnumber of iterations: " + numOfIterations);

// OUTPUT
if (fs.existsSync(outputDir) === false) {
    fs.mkdirSync(outputDir);
}

fs.writeFileSync(
    outputFile,
    util.inspect(result, true, 5, false),
    "utf8"
);