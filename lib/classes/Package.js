"use strict"; // run code in ES5 strict mode

var MetaPackage = require("metaclass").Package,
    ClassError = require("../ClassError.class.js"),
    BuildingState = require("../BuildingState.singleton.js"),
    construct = require("metaclass").helpers.construct,
    path = require("path"),
    paths2obj = require("fshelpers").util.paths2obj,
    buildingState;

/**
 * Parses a descriptor that describes a package and returns an object that exports the specified package components.
 * The descriptor object should be structured like this
 *
 * {
 *      compileOptions: {
 *          srcPath: __dirname,
 *          compiledPath: path.resolve(__dirname, "../compiled") (default)
 *          mode: "dev" (default) | "live",
 *          verbose: false (default) | true
 *      },
 *      exports: [ //
 *          "lib/folder1/MyClass.class",
 *          "lib/folder2/MyInterface.interface"
 *      ]
 * }
 *
 * @class Package
 * @param {js.Object} descriptor
 * @throws {lib.classes.ClassError}
 */
function Package(descriptor) {
    var Public = {constructor: this.constructor},
        print,  // shortcut for this.__print
        self = this;

    this.Public = Public;

    /**
     * @private
     * @type {metaclass.Package}
     */
    this.__metaPack = new MetaPackage();

    /**
     * @private
     */
    this.__init = function __init() {
        var metaPack = this.__metaPack,
            compileOptions,
            exports,
            packagePath,
            packageJSON,
            dependencies;

        buildingState = BuildingState.getInstance();

        this.__checkPreconditions();

        // Init vars
        compileOptions = descriptor.compileOptions;
        buildingState.setVerbose(compileOptions.verbose);
        print("log", "Creating new package ...");
        packagePath = path.resolve(compileOptions.srcPath, "../");
        print("log", "Package path: " + packagePath);
        metaPack.setPath(packagePath);
        exports = descriptor.exports;

        // Applying default values
        this.__applyDefaultValuesToDescriptor();
        print("log", "Compile options: ");
        print("log", compileOptions);

        // Reading dependencies from package.json
        try {
            packageJSON = require(packagePath + "/package.json");
        } catch (e) {
            throw new ClassError("Missing package.json in root directory: You need a package.json for your project, where you declare your dependencies. Take a look at http://npmjs.org/doc/json.html");
        }

        // Preloading dependencies
        print("log", "Preloading dependencies ...");
        this.__preloadDependencies(packageJSON.dependencies);
        if (compileOptions.mode === "dev") {
            print("log", "Preloading devDependencies ...");
            this.__preloadDependencies(packageJSON.devDependencies);
        }
        if (buildingState.getCurrentPackage() !== null) {  // Check if all package creation processes have finished
            throw new ClassError("Package creation error: There are 2 concurrent package creation processes.\nMaybe you havent declared all dependencies in your package.json?");
        }
        print("log", "Preloading finished!");

        // After preloading has been done, we register this package as the current package
        buildingState.setCurrentPackage(this.Public);

        // Loading modules, that will be exported
        if (Array.isArray(exports)) {
            this.__loadExportsModules(descriptor.exports);
        } else {
            print("log", "No 'exports'-array found at descriptor. Assuming that package exports nothing.");
        }

        if (compileOptions.mode === "dev") {    // freezing only in dev mode, because it has an impact on performance
            Object.freeze(this.Public);
        }

        // Telling buildingState, that we're finished with creating the package
        buildingState.setCurrentPackage(null);
    }.bind(this);

    /**
     * Checks whether we can start building the package or there is an error
     *
     * @private
     * @throws {lib.classes.ClassError}
     */
    this.__checkPreconditions = function () {
        var compileOptions,
            srcPath;

        if (buildingState.getCurrentPackage() !== null) {
            throw new ClassError("Package creation error: There are 2 concurrent package creations. Maybe you havent declared all dependencies in your package.json?");
        }
        if (descriptor === undefined || typeof descriptor !== "object") {
            throw new ClassError("Missing package descriptor");
        }
        compileOptions = descriptor.compileOptions;
        if (compileOptions === undefined || typeof compileOptions !== "object") {
            throw new ClassError("Wrong package descriptor: You have to specify the compileOptions property");
        }
        srcPath = compileOptions.srcPath;
        if (typeof srcPath !== "string") {
            throw new ClassError("Wrong package descriptor: Missing srcPath attribute of compileOptions");
        }
        if (path.existsSync(srcPath) === false) {
            throw new ClassError("Wrong package descriptor: " + srcPath + " is no folder.");
        }
    }.bind(this);

    /**
     * @private
     */
    this.__applyDefaultValuesToDescriptor = function () {
        var compileOptions = descriptor.compileOptions,
            packagePath = this.__metaPack.getPath();

        compileOptions.mode = compileOptions.mode === undefined ? "dev" : compileOptions.mode;
        compileOptions.verbose = compileOptions.verbose === undefined ? false : compileOptions.verbose;
        if (buildingState.getContext() === BuildingState.CONTEXT.SHELL) {
            if (typeof compileOptions.compiledPath !== "string") {
                compileOptions.compiledPath = packagePath + "/compiled";
            }
        }
    }.bind(this);

    /**
     * Logs the given string if verbose mode is activated
     *
     * @private
     * @param {js.String} mode the console function to call (e.g. console.log, console.warn, ...)
     * @param {js.String} msg the string to log
     */
    this.__print = function (mode, msg) {
        if (buildingState.getVerbose() === true) {
            console[mode](msg);
        }
    }.bind(this);
    print = this.__print;   // shortcut

    /**
     * @private
     * @param {js.Object} dependencies
     * @throws {lib.classes.ClassError} when a dependency can't be resolved
     */
    this.__preloadDependencies = function (dependencies) {
        var metaPack = this.__metaPack,
            dep,
            depPath,
            key;

        if (dependencies) {
            for (key in dependencies) {
                if (dependencies.hasOwnProperty(key)) {
                    depPath = metaPack.getPath() + "/node_modules/" + key;
                    dep = new MetaPackage();
                    dep
                        .setName(key)
                        .setPath(depPath);
                    metaPack.addDependency(dep);
                    print("log", "Requiring " + depPath);
                    try {
                        require(depPath);   // preloading dependencies
                    } catch (err) {
                        throw new ClassError("Missing dependency " + key + ": It can't be found @ " + depPath);
                    }
                }
            }
        }
    }.bind(this);

    /**
     * @private
     * @param {js.Array} modules array with relative paths to all modules that should be exported
     * @return {}
     */
    this.__loadExportsModules = function (modules) {
        var result = {},
            modulePath = this.__metaPack.getPath() + "/",
            path,
            i;

        // Requiring modules
        print("log", "Loading exports modules...");
        for (i = 0; i < modules.length; i++) {
            path = modules[i];
            //TODO trim file suffixes here
            result[path] = require(modulePath + path);
        }
        print("log", "Loading exports modules finished!");

        // Creating namespace object
        result = paths2obj(result);
        print("log", "Package exports:");
        print("log", result);

        return result;
    }.bind(this);

    /**
     * @public
     * @return {js.String} Root path of the package
     */
    Public.getPath = this.getPath = function () {
        return this.__metaPack.getPath();
    }.bind(this);

    /**
     * @public
     * @return {js.String} Name of the package
     */
    Public.getName = this.getName = function () {
        return this.__metaPack.getName();
    }.bind(this);

    /**
     * Returns an object structured like this:
     *
     * {
     *     "moduleName1": "path/to/module1",
     *     "moduleName2": "path/to/module2
     * }
     *
     * @public
     * @return {js.Object}
     */
    Public.getDependencies = this.getDependencies = function () {
        var deps = this.__metaPack.getAllDependencies(),
            result = {},
            i,
            dep;

        for (i = 0; i < deps.length; i++) {
            dep = deps[i];
            result[dep.getName()] = dep.getPath();
        }

        return result;
    }.bind(this);

    //TODO provide relevant methods of MetaPackage

    return construct.call(this, this.__init);
}

module.exports = Object.freeze(Package);