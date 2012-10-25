"use strict"; // run code in ES5 strict mode

/**
 * Capitalizes the first letter. Used for camelCase-names for all setters and getters.
 * 
 * @private
 * @param {String} string
 * @returns {String} string
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Modifies the key-string, so it looks like an ordinary setter.
 * someProperty becomes setSomeProperty
 * 
 * @private
 * @param {String} key
 * @returns {String} key
 */
function setter(key) {
    return 'set' + capitalize(trimPrefix(key));
}

/**
 * Modifies the key-string, so it looks like an ordinary getter.
 * someProperty becomes getSomeProperty
 * 
 * @private
 * @param {String} key
 * @returns {String} key
 */
function getter(key) {
    return 'get' + capitalize(trimPrefix(key));
}

/**
 * Trims all prefixes like _ __ ? $
 * 
 * @private
 * @param {String} key
 * @returns {String} key
 */
function trimPrefix(key) {
    return key.replace(/^(\$|_{1,2}|\?_{0,2})/, '');
}

exports.capitalize = capitalize;
exports.setter = setter;
exports.getter = getter;
exports.trimPrefix = trimPrefix;