// Some constant values that are not expected to change
const version = `0.0.3a`;
const onDesktopApp = document.location.href.includes('resources/app.asar');

module.exports = {
  version,
  onDesktopApp,
}
