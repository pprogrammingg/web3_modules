#!/usr/bin/env node
/**
 * HTML skeleton contracts (filesystem only — not a real browser render).
 * Catches deleted wrappers / renamed hub mount IDs. Run: node tests/render-contracts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function read(rel) {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function fail(rel, name) {
    console.error('  ❌', rel + ':', name);
    return false;
}

function ok(rel, name) {
    console.log('  ✅', rel + ':', name);
    return true;
}

let errors = 0;

function page(rel, checks) {
    let html;
    try {
        html = read(rel);
    } catch (e) {
        console.error('  ❌', rel, '— missing or unreadable');
        errors++;
        return;
    }
    for (const { name, test } of checks) {
        if (!test(html)) {
            fail(rel, name);
            errors++;
        } else ok(rel, name);
    }
}

console.log('render-contracts: HTML skeleton checks\n');

page('index.html', [
    { name: 'track picker grid', test: (h) => h.includes('track-grid') },
    {
        name: 'five track destinations',
        test: (h) =>
            ['hyperscale/index.html', 'solana-core/index.html', 'crypto-fintech/index.html', 'zk/index.html', 'evm/index.html'].every(
                (href) => h.includes(`href="${href}"`)
            )
    },
    {
        name: 'main stylesheet link',
        test: (h) => /id=["']main-styles["']/.test(h) && h.includes('common/styles.css')
    }
]);

const hubBase = [
    { name: 'container', test: (h) => h.includes('class="container"') },
    {
        name: 'main-styles + ensure-styles',
        test: (h) => h.includes('id="main-styles"') && h.includes('ensure-styles.js')
    }
];

const HUB_EXTRA = {
    'hyperscale/index.html': [
        {
            name: 'progress + module roots',
            test: (h) => h.includes('id="overall-progress"') && h.includes('id="basic-modules"')
        }
    ],
    'crypto-fintech/index.html': [
        {
            name: 'crypto hub mounts',
            test: (h) => h.includes('id="crypto-basic-modules"') && h.includes('initializeCryptoCourseIndex')
        }
    ],
    'zk/index.html': [
        {
            name: 'zk hub mounts',
            test: (h) => h.includes('id="zk-basic-modules"') && h.includes('initializeZkCourseIndex')
        }
    ],
    'evm/index.html': [
        {
            name: 'evm hub mount',
            test: (h) => h.includes('id="evm-modules"') && h.includes('initializeEvmCourseIndex')
        }
    ]
};

for (const hub of ['hyperscale/index.html', 'solana-core/index.html', 'crypto-fintech/index.html', 'zk/index.html', 'evm/index.html']) {
    page(hub, [...hubBase, ...(HUB_EXTRA[hub] || [])]);
}

page('common/glossary.html', [
    { name: 'glossary mount', test: (h) => h.includes('id="glossary-content"') && h.includes('glossary.js') }
]);

if (errors) {
    console.error(`\nrender-contracts: FAILED (${errors} error(s))`);
    process.exit(1);
}
console.log('\nrender-contracts: OK');
