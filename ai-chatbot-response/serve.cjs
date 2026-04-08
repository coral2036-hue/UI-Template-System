const path = require('path');
process.chdir(__dirname);
require('child_process').spawn(
  process.execPath,
  [path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js'), '--port', '5506', '--host'],
  { stdio: 'inherit', cwd: __dirname }
);
