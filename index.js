#!/usr/bin/env node

import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { exit } from 'process';

const program = new Command();

program
  .description('recovery code registry from .git directory')
  .name('recovery-git')
  .option('-n, --name [name]', 'rename code repo\'s name');

program.parse(process.argv);

const options = program.opts();

// get workdir
const dir = path.basename(process.cwd());

console.log('[Info]: creating bunlde....');

const repo = dir.slice(0, dir.length - 4);

if (fs.existsSync(`${repo}.bundle`)) {
  console.warn(`[Warning]: ${repo}.bundle file already exists, make sure it is correct, skip create bundle...`);
} else {
  // create bunlde
  execSync(`git bundle create ./${repo}.bundle --all`);
}
console.log('[Info]: checking directory...');

let registryName = repo;

// set code repo name
registryName = options.name || repo;

if (fs.existsSync(`../${registryName}`)) {
  console.warn(`[Error]: ../${registryName} directory already exists, please remove it and execute recovery again!`);
  exit(0);
}

console.log(`[Info]: check completed, ../${registryName} directory will be created...`);

// clone repo from bundle
execSync(
  `git clone ./${repo}.bundle ../${registryName} -v`,
  { stdio: 'inherit' },
);

console.info(`\n\n[Success]: √ please execute follow command to check git status.\n\n cd ../${registryName} \n git status`);

exit(0);
