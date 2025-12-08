const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app', 'api', 'settings'),
  path.join(__dirname, 'app', '(admin)', 'adm', 'settings')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created:', dir);
  } else {
    console.log('Already exists:', dir);
  }
});

console.log('Done!');
