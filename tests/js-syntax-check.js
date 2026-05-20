#!/usr/bin/env node
/**
 * Syntax-only validation: node --check on every committed JS we rely on at runtime.
 * Run from repo root: node tests/js-syntax-check.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function collectJsFiles(dirRel) {
    const abs = path.join(ROOT, dirRel);
    if (!fs.existsSync(abs)) return [];
    return fs
        .readdirSync(abs, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith('.js'))
        .map((e) => path.join(dirRel, e.name).split(path.sep).join('/'));
}

const files = [
    ...collectJsFiles('common'),
    'scripts/sanity-pages.js',
    'scripts/reflect-changes.js',
    'scripts/check-hyperscale-changes.js',
    'scripts/check-solana-changes.js',
    'verify-paths.js',
    'animations/scripts/check-animation-consistency.js',
    ...fs.readdirSync(path.join(ROOT, 'tests'))
        .filter((n) => n.endsWith('.js') && n !== 'js-syntax-check.js')
        .map((n) => 'tests/' + n),
].filter((rel) => fs.existsSync(path.join(ROOT, rel)));

files.push('tests/js-syntax-check.js');

let failed = 0;
for (const rel of files) {
    try {
        execSync(`node --check "${rel}"`, { cwd: ROOT, stdio: 'pipe' });
        console.log('  ✅', rel);
    } catch (e) {
        console.error('  ❌', rel);
        failed++;
    }
}

if (failed) {
    console.error(`\njs-syntax-check: ${failed} file(s) failed.`);
    process.exit(1);
}
console.log(`\njs-syntax-check: OK (${files.length} files).`);
