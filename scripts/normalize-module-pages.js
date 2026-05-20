#!/usr/bin/env node
/**
 * Replace deprecated inline layout patterns on curriculum modules with shared CSS classes.
 * Run from repo root: node scripts/normalize-module-pages.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TRACK_DIRS = ['zk', 'crypto-fintech', 'evm', 'hyperscale', 'solana-core'];

const REPLACEMENTS = [
    [
        /<p style="font-size:0\.92rem;color:var\(--text2\);">/g,
        '<p class="module-footnote">'
    ],
    [
        /<p style="font-size:0\.92rem;color:var\(--text2\);margin-bottom:0;">/g,
        '<p class="module-footnote module-footnote--tight">'
    ],
    [
        /<p style="margin:0;font-size:0\.92rem;color:var\(--text2\);">/g,
        '<p class="module-footnote module-footnote--tight">'
    ],
    [
        /<nav class="navigation" style="margin-top:2rem;">/g,
        '<nav class="navigation module-nav">'
    ],
    [
        /<p style="margin-top:1rem;"><button type="button" class="btn btn-primary" id="complete-module-btn">Mark module complete<\/button><\/p>/g,
        '<div class="module-actions"><button type="button" class="btn btn-primary" id="complete-module-btn">Mark module complete</button></div>'
    ],
    [
        /<p><button type="button" class="btn btn-primary" id="complete-module-btn">Mark module complete<\/button><\/p>/g,
        '<div class="module-actions"><button type="button" class="btn btn-primary" id="complete-module-btn">Mark module complete</button></div>'
    ],
    [
        /<p><button type="button" class="btn btn-primary" id="complete-module-btn">Mark module complete<\/button><\/div>/g,
        '<div class="module-actions"><button type="button" class="btn btn-primary" id="complete-module-btn">Mark module complete</button></div>'
    ],
    [
        /<p style="margin-bottom:0\.5rem;">/g,
        '<p class="module-prose-note">'
    ]
];

function walkHtml(dirRel) {
    const abs = path.join(ROOT, dirRel);
    if (!fs.existsSync(abs)) return [];
    const out = [];
    for (const name of fs.readdirSync(abs)) {
        const rel = path.join(dirRel, name).split(path.sep).join('/');
        const p = path.join(ROOT, rel);
        if (fs.statSync(p).isDirectory()) out.push(...walkHtml(rel));
        else if (name.endsWith('.html') && name !== 'index.html') out.push(rel);
    }
    return out;
}

let changed = 0;
for (const dir of TRACK_DIRS) {
    for (const rel of walkHtml(dir)) {
        const full = path.join(ROOT, rel);
        let html = fs.readFileSync(full, 'utf8');
        const before = html;
        for (const [re, sub] of REPLACEMENTS) {
            html = html.replace(re, sub);
        }
        if (html !== before) {
            fs.writeFileSync(full, html);
            changed++;
            console.log('updated', rel);
        }
    }
}
console.log(changed ? `Done (${changed} file(s)).` : 'No changes needed.');
