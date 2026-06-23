#!/usr/bin/env node
/** Add flow-steps-compact-first to syllabus tables (col 1 = # or Segment). */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walk(dir, acc = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === '.git') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, acc);
        else if (e.name.endsWith('.html')) acc.push(p);
    }
    return acc;
}

let updated = 0;
for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file);
    let html = fs.readFileSync(file, 'utf8');
    const orig = html;
    html = html.replace(
        /<table class="flow-steps">(\s*<thead>\s*<tr><th scope="col">#<\/th>)/g,
        '<table class="flow-steps flow-steps-compact-first">$1'
    );
    html = html.replace(
        /<table class="flow-steps">(\s*<thead><tr><th>Segment<\/th>)/g,
        '<table class="flow-steps flow-steps-compact-first">$1'
    );
    if (html !== orig) {
        fs.writeFileSync(file, html);
        console.log('  ', rel);
        updated++;
    }
}
console.log(`Updated ${updated} file(s).`);
