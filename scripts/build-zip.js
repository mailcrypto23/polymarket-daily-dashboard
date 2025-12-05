const fs = require('fs'), archiver = require('archiver');
const output = fs.createWriteStream('polymarket-daily-dashboard-premium.zip');
const archive = archiver('zip');
output.on('close', ()=> console.log('zip created',archive.pointer()));
archive.pipe(output);
archive.directory('src/', 'src');
archive.file('package.json');
archive.file('README.md');
archive.finalize();
