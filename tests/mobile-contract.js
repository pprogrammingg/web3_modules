#!/usr/bin/env node
/**
 * Mobile layout contracts (filesystem only — no browser).
 * - Every curriculum/hub page has viewport meta
 * - Segment tables use .table-wrap (horizontal scroll on narrow screens)
 * - styles.css contains shared mobile rules (one source of truth)
 *
 * Manual spot-check: open mobile-test.html on a phone or narrow DevTools.
 * Run: node tests/mobile-contract.js
 */
const fs = require('fs');
const path = require('path');
const { ROOT, loadLayoutPages } = require('./lib/page-inventory');

const STYLES = fs.readFileSync(path.join(ROOT, 'common/styles.css'), 'utf8');

const CSS_MARKERS = [
    { name: 'navigation stacks on narrow screens', re: /@media\s*\(\s*max-width:\s*640px\s*\)[\s\S]*\.navigation[\s\S]*flex-direction:\s*column/ },
    { name: 'tables scroll horizontally', re: /\.table-wrap\s*\{[^}]*overflow-x:\s*auto/ },
    { name: 'touch scrolling on table-wrap', re: /\.table-wrap[^}]*-webkit-overflow-scrolling:\s*touch/ },
    { name: 'course-content padding on mobile', re: /@media\s*\(\s*max-width:\s*640px\s*\)[\s\S]*\.course-content[\s\S]*padding/ }
];

const VIEWPORT_RE = /<meta\s+name=["']viewport["']\s+content=["']width=device-width/i;

let errors = 0;

function err(msg) {
    console.error('  ❌', msg);
    errors++;
}

function ok(msg) {
    console.log('  ✅', msg);
}

console.log('mobile-contract: layout pages + shared CSS\n');

const pages = loadLayoutPages();
ok(`Checking ${pages.length} HTML page(s)`);

for (const rel of pages) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
        err(`${rel}: missing`);
        continue;
    }
    const html = fs.readFileSync(full, 'utf8');
    if (!VIEWPORT_RE.test(html)) {
        err(`${rel}: missing viewport meta (width=device-width)`);
    }
    if (html.includes('class="flow-steps"') || html.includes("class='flow-steps'")) {
        if (!html.includes('table-wrap')) {
            err(`${rel}: flow-steps table must be wrapped in .table-wrap for mobile scroll`);
        }
    }
}

for (const { name, re } of CSS_MARKERS) {
    if (!re.test(STYLES)) err(`styles.css: missing mobile rule — ${name}`);
    else ok(`styles.css: ${name}`);
}

if (!fs.existsSync(path.join(ROOT, 'mobile-test.html'))) {
    err('mobile-test.html missing (manual mobile checklist)');
} else {
    ok('mobile-test.html present for manual spot-check');
}

if (errors) {
    console.error(`\nmobile-contract: FAILED (${errors} error(s))`);
    process.exit(1);
}
console.log('\nmobile-contract: OK');
