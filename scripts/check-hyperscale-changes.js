#!/usr/bin/env node
/**
 * Legacy entry point — delegates to scripts/reflect-changes.js hyperscale
 * @deprecated Use: node scripts/reflect-changes.js hyperscale [--save] [diff-target]
 */
const path = require('path');
const { spawnSync } = require('child_process');
const child = path.join(__dirname, 'reflect-changes.js');
const r = spawnSync(process.execPath, [child, 'hyperscale', ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status === null ? 1 : r.status);
