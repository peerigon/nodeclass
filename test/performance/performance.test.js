"use strict"; // run code in ES5 strict mode

var _ = require("underscore"),
    path = require("path"),
    logger = require("../../lib/logger.js"),
    fs = require("fs"),
    util = require("util"),
    clc = require("cli-color");

var outputDir = __dirname + "/results",
    now = new Date(),
    title = process.argv[2],
    numOfIterations = 100000,
    outputFile = outputDir + "/" +
        title + " " + numOfIterations +
        ".json",
    nodeClassPath = "./C.class.js",
    classicPath = "./C.js",
    Class,
    result = {
        setup: {
            title: title,
            date: now.toUTCString(),
            numOfIterations: numOfIterations,
            nodeClassPath: nodeClassPath,
            classicPath: classicPath,
            unit: "milliseconds"
        },
        tests: {
            nodeclass: {},
            classic: {},
            classicBinding: {}
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

// PRINT SETUP
console.log("\nTest: ", title);
console.log("Number of iterations: " + numOfIterations);
console.log("\n" + clc.blackBright("-------------------------------------------------------------------------------"));

// NODECLASS
console.log("\n" + clc.underline("nodeclass"));
result.tests.nodeclass.compilation = perform(operations.compilation, nodeClassPath);
Class = require(nodeClassPath);
result.tests.nodeclass.instantiation = perform(operations.instantiation, Class);
result.tests.nodeclass.execution = perform(operations.execution, new Class());

// CLASSIC
console.log("\n" + clc.underline("classic"));
result.tests.classic.compilation = perform(operations.compilation, classicPath);
Class.withBinding = false;
Class = require(classicPath);
result.tests.classic.instantiation = perform(operations.instantiation, Class);
result.tests.classic.execution = perform(operations.execution, new Class());

// CLASSIC (BINDING)
console.log("\n" + clc.underline("classic (binding)"));
result.tests.classicBinding.compilation = perform(operations.compilation, classicPath);
Class = require(classicPath);
Class.withBinding = true;
result.tests.classicBinding.instantiation = perform(operations.instantiation, Class);
result.tests.classicBinding.execution = perform(operations.execution, new Class());

console.log("\n" + clc.blackBright("-------------------------------------------------------------------------------"));

if (!title) {
    return; // no output without title
}

// OUTPUT
if (fs.existsSync(outputDir) === false) {
    fs.mkdirSync(outputDir);
}

fs.writeFileSync(
    outputFile,
    util.inspect(result, true, 5, false),
    "utf8"
);