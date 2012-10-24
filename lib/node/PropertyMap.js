"use strict"; // run code in ES5 strict mode

/**
 * @private
 * @constructor
 */
function PropertyMap() {
    /**
     * @type {Object}
     */
    this.private = { attribute: [], method: {} };

    /**
     * @type {Object}
     */
    this.protected = { attribute: {}, method: {} };

    /**
     * @type {Object}
     */
    this.public = { attribute: {}, method: {} };

    /**
     * @type {Object}
     */
    this.static = { attribute: {}, method: {} };
}

module.exports = PropertyMap;