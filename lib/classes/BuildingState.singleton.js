"use strict"; // run code in ES5 strict mode

var Package /* = require("./Package.class") - cannot require here to avoid circular dependency */,
    construct = require("metaclass").helpers.construct,
    is = require("metaclass").helpers.is,
    instance;

/**
 * Provides some information about the current building state.
 * This class is a singleton.
 *
 * @class State
 */
function BuildingState() {
    var Public = {constructor: this.constructor},
        self = this;

    this.Public = Public;

    // return existing instance if the constructor was accidently called via "new"
    if (instance !== undefined) {
        return instance;
    } else {
        instance = this;
    }

    /**
     * @private
     */
    this.__init = function () {
        // Requiring modules that could not be required because of circular dependencies
        Package = require("./Package.class");
    }.bind(this);

    /**
     * @private
     * @type {lib.classes.Package}
     */
    this.__currentPackage = null;

    /**
     * @private
     * @type {js.Object}
     */
    this.__packages = {};

    /**
     * @private
     * @type {js.String}
     */
    this.__context = BuildingState.CONTEXT.LIB;

    /**
     * @private
     * @type {js.Object}
     */
    this.__descriptorParsers = {};

    /**
     * @private
     * @type {js.Boolean}
     */
    this.__verbose = false;

    /**
     * @private
     * @type {js.Object}
     */
    this.__filenameSuffixes = {};

    /**
     * @public
     * @param {js.Boolean} verbose
     * @throws {js.TypeError}
     * @return {lib.classes.BuildingState}
     */
    Public.setVerbose = this.setVerbose = function (verbose) {
        if (typeof verbose !== "boolean") {
            throw new TypeError("verbose must be type of boolean");
        }
        this.__verbose = verbose;
        return Public;
    }.bind(this);

    /**
     * @public
     * @return {js.Boolean}
     */
    Public.getVerbose = this.getVerbose = function () {
        return this.__verbose;
    }.bind(this);

    /**
     * @public
     * @param {lib.classes.Package} currentPackage
     * @throws {js.TypeError}
     * @return {lib.classes.BuildingState}
     */
    Public.setCurrentPackage = this.setCurrentPackage = function (currentPackage) {
        if (currentPackage !== null && is(currentPackage).instanceOf(Package) === false) {
            throw new TypeError("currentPackage must be an instance of lib.classes.Package");
        }
        if (currentPackage !== null) {
            if (!currentPackage.getPath()) {    // loose equality wanted here explicitly
                throw new Error("currentPackage.getPath() must return a path");
            }
            this.__packages[currentPackage.getPath()] = currentPackage;
        }
        this.__currentPackage = currentPackage;
        return Public;
    }.bind(this);

    /**
     * @public
     * @return {lib.classes.Package}
     */
    Public.getCurrentPackage = this.getCurrentPackage = function () {
        return this.__currentPackage;
    }.bind(this);

    /**
     * Returns the package found at package path. The package must have registered itself before via setCurrentPackage()
     *
     * @public
     * @param {js.String} packagePath
     * @throws {js.TypeError}
     * @return {lib.classes.Package}
     */
    Public.getPackage = this.getPackage = function (packagePath) {
        if (typeof packagePath !== "string") {
            throw new TypeError("packagePath must be a string");
        }
        return this.__packages[packagePath] || null;
    }.bind(this);

    /**
     * @public
     * @param {js.String} context
     * @return {lib.classes.BuildingState}
     */
/*    Public.setContext = this.setContext = function (context) {
        if (context !== BuildingState.CONTEXT.SHELL && context !== BuildingState.CONTEXT.LIB) {
            throw new TypeError("The context must either be '" + BuildingState.CONTEXT.SHELL + "' or '" + BuildingState.CONTEXT.LIB + "'");
        }
        this.__context = context;
        return Public;
    }.bind(this); */

    /**
     * @public
     * @return {js.String}
     */
    Public.getContext = this.getContext = function () {
        return this.__context;
    }.bind(this);

    /**
     * Registers a function as a descriptor parser
     *
     * @public
     * @param {js.String} suffix
     * @param {js.Function} descriptorParser
     * @throws {js.TypeError}
     * @throws {js.Error} When the suffix is already registered
     */
    Public.addDescriptorParser = this.addDescriptorParser = function (suffix, descriptorParser) {
        var parsers = this.__descriptorParsers;

        if (typeof suffix !== "string") {
            throw new TypeError("The suffix must be typeof string");
        }
        if (typeof descriptorParser !== "function") {
            throw new TypeError("The descriptorParser must be typeof function");
        }
        if (parsers[suffix] !== descriptorParser) {
            throw new Error("The suffix is already occupied by the descriptor parser: " + descriptorParser);
        }

        parsers[suffix] = descriptorParser;
    }.bind(this);

    /**
     * @public
     * @return {js.Object} An object with all descriptor parsers and their suffixes as keys
     */
    Public.getDescriptorParsers = this.getDescriptorParsers = function () {
        var result = {},
            parsers = this.__descriptorParsers,
            key;

        for (key in parsers) {
            if (parsers.hasOwnProperty(key)) {
                result[key] = parsers[key]; // copying the original object
            }
        }

        return result;
    }.bind(this);

    return construct.call(this, this.__init);
}

BuildingState.getInstance = function () {
    return instance || new BuildingState();
};

BuildingState.CONTEXT = {
    "SHELL": "SHELL",
    "LIB": "LIB"
};

module.exports = Object.freeze(BuildingState);