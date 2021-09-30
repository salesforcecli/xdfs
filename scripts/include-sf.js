#!/usr/bin/env node

const path = require('path');
const shelljs = require('shelljs');
const fs = require('fs');

const npmGlobalBin = shelljs.exec('npm list -g --depth 0 | head -1').stdout.trim();
const sfGlobalPath = path.join(npmGlobalBin, 'node_modules', '@salesforce', 'cli');
const sfRoot = path.join(process.cwd(), 'sf-cli');

// Copy globally installed sf to sf-cli/ at root of sfdx
shelljs.mv('-f', sfGlobalPath, sfRoot);

const sfUnixPath = 'sf-cli/bin/run';
const sfBin = path.join('bin', 'sf');
const sfdxBin = path.join('bin', 'sfdx');

console.log(`---- Including SF ----`);
console.log(`  Updating ${sfdxBin} with references to sf`);
const binContents = fs
  .readFileSync(sfdxBin, 'UTF-8')
  .replace(/sfdx/g, 'sf')
  .replace(/SFDX/g, 'SF')
  .replace(/\$DIR\/run/g, sfUnixPath);

console.log(`  Writing ${sfBin}`);
fs.writeFileSync(sfBin, binContents);
shelljs.chmod('+x', sfBin);

const sfWinPath = 'sf-cli\\bin\\run.cmd';
const sfCmd = path.join('bin', 'sf.cmd');
const sfdxCmd = path.join('bin', 'sfdx.cmd');

console.log(`  Updating ${sfCmd} with references to sf`);
const cmdContents = fs
  .readFileSync(sfdxCmd, 'UTF-8')
  .replace(/sfdx/g, 'sf')
  .replace(/SFDX/g, 'SF')
  .replace(/bin\\run/g, sfWinPath);

console.log(`  Writing ${sfCmd}`);
fs.writeFileSync(sfCmd, cmdContents);

console.log(`---- Finished ----`);
