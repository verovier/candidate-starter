#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

const cwd = resolve(__dirname, '..');
const out = resolve(cwd, '..', 'candidate-starter.zip');

const args = ['-r', out, '.', '-x', 'node_modules/*', '.svelte-kit/*', 'dist/*'];
const res = spawnSync('zip', args, { cwd, stdio: 'inherit' });
if (res.status !== 0) {
	console.error('Failed to create zip. Ensure `zip` is installed.');
	process.exit(res.status || 1);
}
console.log(`Created ${out}`);
