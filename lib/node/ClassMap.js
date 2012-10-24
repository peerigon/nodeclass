"use strict"; // run code in ES5 strict mode

var PropertyMap = require("./PropertyMap.js");

/**
 * @private
 * @constructor
 */
function ClassMap() {

    /**
     * @type {Boolean}
     */
    this.hasInit = false;

    /**
     * @type {String}
     */
    this.className = "Constructor";

    /**
     * @type {PropertyMap}
     */
    this.properties = new PropertyMap();

    /**
     * @type {PropertyMap}
     */
    this.superProperties = null;

    /**
     * @type {Object<String, Function>}
     */
    this.overriddenMethods = {};
}

module.exports = ClassMap;