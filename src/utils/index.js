/**
 * Calls hasOwnProperty without doing it on the main object.
 * @param {Object} object The object to check for the key on.
 * @param {String} key The key to check for.
 */
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

modules.exports = {
  hasOwn,
};