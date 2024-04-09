const { rimrafSync } = require('rimraf');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

(async function() {
  let didCleanup = false;
  function cleanup() {
    if (didCleanup) return;
    didCleanup = true;
    rimrafSync('./build', { preserveRoot: false });
  }
  rimrafSync('./build', { preserveRoot: false });
  try { fs.unlinkSync('./built.js'); } catch {}
  fs.mkdirSync('./build');
  fs.readFile('./src/userscript_header.js', (err, data) => {
    const userscriptHeader = data ?? '/* header was missing? */';
    if (err) {
      cleanup();
      console.error('Failed to read "src/userscript_header.js".\n', err);
      return err;
    }
    exec('npx webpack', (err) => {
      if (err) {
        cleanup();
        console.error('Failed to run webpack.\n', err);
        return err;
      }
      fs.readFile('./build/bundle.js', (err, data) => {
        if (err) {
          cleanup();
          console.error('Failed to read "build/bundle.js".\n', err);
          return err;
        }
        const built = `${userscriptHeader}\n/* Last build: ${Date.now()} */\n${data}`;
        fs.writeFile('./built.js', built, 'utf8', () => {});
        cleanup();
      });
    });
  });
})();