const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, files);
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripComments(code) {
  let result = code;
  // Block comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Line comments (ignore if preceded by :)
  result = result.replace(/(?<!:)\/\/.*$/gm, '');
  return result;
}

const frontendFiles = getFiles(path.join(__dirname, 'frontend', 'src'));
const backendFiles = getFiles(path.join(__dirname, 'backend', 'src'));
const allFiles = [...frontendFiles, ...backendFiles];

let cleanedCount = 0;
for (const file of allFiles) {
  const code = fs.readFileSync(file, 'utf8');
  const cleanedCode = stripComments(code);
  if (code !== cleanedCode) {
    fs.writeFileSync(file, cleanedCode, 'utf8');
    console.log(`Cleaned: ${file}`);
    cleanedCount++;
  }
}
console.log(`Finished removing comments. Cleaned ${cleanedCount} files.`);
