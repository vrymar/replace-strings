import { getInput, setFailed } from '@actions/core';
import { statSync, readdirSync, readFile, writeFile } from 'fs';
import { join } from 'path';

async function run() {
  try {
    const stats = statSync(getInput('files'));

    if (stats.isDirectory()) {
      console.log(`${dirPath} is a directory. Reading files paths...`);
      const files = readdirSync(dirPath);
      const filePaths = files.map(file => join(dirPath, file)).join(',');
      console.log(`Found files: ${filePaths}`);
    } 

    const files = getInput('files').split(',');
    const replacements = getInput('replacements').split(',').map(r => r.split('='));

    for (const file of files) {
      let content = await readFile(file.trim(), 'utf-8');

      for (const [find, replace] of replacements) {
        content = content.replace(new RegExp(find.trim(), 'g'), replace.trim());
      }

      await writeFile(file.trim(), content);
    }
  } catch (error) {
    setFailed(error.message);
  }
}

run();