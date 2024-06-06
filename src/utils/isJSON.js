module.exports = function isJSON(str) {
  const jsonRegex = /^[\],:{}\s]*$/
      .test(str.replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
  if (!jsonRegex) return false;
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
};