#!/usr/bin/env node
/**
 * Module reading-surface CSS contract — catches grey/white patchwork regressions.
 *
 * Prior tests (module-page-contract, mobile-contract) only checked HTML shell and
 * that markers exist somewhere in styles.css; not cascade order or section bg.
 *
 * Run: node tests/module-surface-contract.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STYLES = fs.readFileSync(path.join(ROOT, 'common/styles.css'), 'utf8');

let errors = 0;

function err(msg) {
    console.error('  ❌', msg);
    errors++;
}

function ok(msg) {
    console.log('  ✅', msg);
}

function indexOf(re) {
    const m = STYLES.match(re);
    return m ? m.index : -1;
}

console.log('module-surface-contract: grey/white surface rules in styles.css\n');

const globalThIdx = indexOf(/th\s*\{\s*background:\s*var\(--bg2\)/);
const moduleBgIdx = indexOf(
    /\.course-content table th,\s*\n\.course-content table td,\s*\n\.course-content \.table-wrap th,\s*\n\.course-content \.table-wrap td\s*\{[^}]*background-color:\s*var\(--bg\)/
);

if (globalThIdx < 0) err('missing global th { background: var(--bg2) }');
else ok('global grey table headers defined (for non-module tables)');

if (moduleBgIdx < 0) {
    err('missing .course-content table/th/td background-color: var(--bg) block');
} else if (globalThIdx >= 0 && moduleBgIdx <= globalThIdx) {
    err(
        'module table background override must appear AFTER global th { bg2 } in styles.css'
    );
} else ok('module table override follows global th (no grey/white row striping)');

if (!/\.course-content \.section\s*\{[^}]*background:\s*transparent/.test(STYLES)) {
    err('.course-content .section must use background: transparent');
} else if (
    /\.course-content \.section\s*\{[^}]*background:\s*var\(--bg2\)/.test(STYLES)
) {
    err('.course-content .section must not use background: var(--bg2)');
} else ok('.course-content .section is transparent (no nested grey panels)');

if (
    !/body\.evm-track:has\(\.course-content\)[\s\S]*background:\s*var\(--bg\)/.test(STYLES)
) {
    err('module pages: body.evm-track:has(.course-content) should use white page background');
} else ok('evm module pages: body background matches reading card');

if (!/\.course-content \.table-wrap\s*\{[^}]*background:\s*var\(--bg\)/.test(STYLES)) {
    err('.course-content .table-wrap needs solid --bg behind scrollable tables');
} else ok('.course-content .table-wrap has opaque background');

if (
    !/\.course-content \.evm-polished-hero\.polished-stone-surface::before[\s\S]*mix-blend-mode:\s*normal/.test(
        STYLES
    )
) {
    err('evm module hero: disable mix-blend-mode on ::before');
} else ok('evm module hero: blend mode contained');

if (errors) {
    console.error(`\nmodule-surface-contract: FAILED (${errors} error(s))`);
    process.exit(1);
}
console.log('\nmodule-surface-contract: OK');
