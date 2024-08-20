const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');

async function run() {
  try {
    const stats = fs.statSync(core.getInput('files'));

    if (stats.isDirectory()) {
      console.log(`${dirPath} is a directory. Reading files paths...`);
      const files = fs.readdirSync(dirPath);
      const filePaths = files.map(file => path.join(dirPath, file)).join(',');
      console.log(`Found files: ${filePaths}`);
    } 

    const files = core.getInput('files').split(',');
    const replacements = core.getInput('replacements').split(',').map(r => r.split('='));

    for (const file of files) {
      let content = await fs.readFile(file.trim(), 'utf-8');

      for (const [find, replace] of replacements) {
        content = content.replace(new RegExp(find.trim(), 'g'), replace.trim());
      }

      await fs.writeFile(file.trim(), content);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();