#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');

spawnSync(process.execPath, ['tools/generate-llms.js'], {
  stdio: 'inherit',
  shell: false,
  cwd: appRoot,
});

const viteBin = path.resolve(appRoot, '..', '..', 'node_modules', 'vite', 'bin', 'vite.js');

const result = spawnSync(process.execPath, [viteBin, 'build', '--outDir', '../../dist/apps/web'], {
  stdio: 'inherit',
  shell: false,
  cwd: appRoot,
});

process.exit(result.status ?? 1);
