const prefix = 'PawLoader |';
const log = (...a) => console.log(prefix, ...a);
const warn = (...a) => console.warn(prefix, ...a);
const error = (...a) => console.error(prefix, ...a);
module.exports = { log, warn, error };