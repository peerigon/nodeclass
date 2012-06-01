"use strict"; // run code in ES5 strict mode

var build = require("./build.js"),
    vm = require("vm");

function Class(Class) {
    var hasSuperClass;

    function getClassModuleMock() {
        var classModuleMock = {
            module: {},
            console: console
        };

        classModuleMock.Class = Class;
        if (hasSuperClass) {
            classModuleMock.Extends = Class.Extends.$classModuleFake;
        }

        return classModuleMock;
    }

    function main() {
        var classModuleMock,
            Constructor,
            src;

        hasSuperClass = Class.Extends !== undefined;
        classModuleMock =  getClassModuleMock();
        src = build(classModuleMock);

        classModuleMock.Extends = Class.Extends;
        vm.runInNewContext(src, classModuleMock);

        Constructor = classModuleMock.Constructor;
        Constructor.$classModuleFake = classModuleMock;

        return Constructor;
    }

    return main();
}

module.exports = Class;