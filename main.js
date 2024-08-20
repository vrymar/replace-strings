const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');


async function run() {
  const inputFiles = core.getInput('files');
  const files = inputFiles.split(',').map(file => file.trim());
  const replacements = core.getInput('replacements').split(',').map(r => r.split('='));

  try {    
    for (const filePath of files) {
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        // Process directory to list files
        console.log(`${filePath} is a directory. Reading file paths...`);
        const filesInDir = await fs.readdir(filePath);
        const filePaths = filesInDir.map(file => path.join(filePath, file)).join(',');
        console.log(`Found files: ${filePaths}`);
        // Process files in the directory
        for (const file of filesInDir) {
          const fullPath = path.join(filePath, file);
          await processFile(fullPath, replacements);
        }
      } else if (stats.isFile()) {
        // Process individual file
        await processFile(filePath, replacements);
      } else {
        console.log(`${filePath} is neither a file nor a directory`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function processFile(filePath, replacements) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');

    for (const [find, replace] of replacements) {
      content = content.replace(new RegExp(find.trim(), 'g'), replace.trim());
    }

    await fs.writeFile(filePath, content);
    console.log(`Processed file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to process file ${filePath}: ${error.message}`);
  }
}

run();