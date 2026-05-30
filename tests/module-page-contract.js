#!/usr/bin/env node
/**
 * Curriculum module HTML shell contract (all tracks).
 * Run: node tests/module-page-contract.js
 */
const fs = require('fs');
const path = require('path');
const {
    ROOT,
    HUB_PAGES,
    walkHtml,
    loadCurriculumModulePaths
} = require('./lib/page-inventory');

const TRACK_BODY = {
    'zk/': 'zk-track',
    'crypto-fintech/': 'crypto-track',
    'evm/': 'evm-track'
};

const DEPRECATED_INLINE = [
    /style="font-size:0\.92rem;color:var\(--text2\)/,
    /<nav class="navigation" style="margin-top:2rem;">/,
    /<p style="margin-top:1rem;"><button[^>]*id="complete-module-btn"/,
    /<p><button[^>]*id="complete-module-btn"/
];

const MODULE_INIT_EXEMPT = new Set(
    walkHtml('solana-core').filter((p) => p !== 'solana-core/index.html')
);

function trackPrefix(rel) {
    for (const prefix of Object.keys(TRACK_BODY)) {
        if (rel.startsWith(prefix)) return prefix;
    }
    return null;
}

let errors = 0;

function err(msg) {
    console.error('  ❌', msg);
    errors++;
}

function ok(msg) {
    console.log('  ✅', msg);
}

console.log('module-page-contract: curriculum module shell\n');

const modules = loadCurriculumModulePaths();
ok(`Checking ${modules.length} module HTML file(s)`);

for (const rel of modules) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
        err(`${rel}: missing file (listed in course data)`);
        continue;
    }
    const html = fs.readFileSync(full, 'utf8');
    const isHub = HUB_PAGES.has(rel);

    if (!/id=["']main-styles["']/.test(html) || !html.includes('styles.css')) {
        err(`${rel}: missing stylesheet link with id="main-styles"`);
    }
    if (!html.includes('ensure-styles.js')) {
        err(`${rel}: missing ensure-styles.js`);
    }
    if (!html.includes('class="course-content')) {
        err(`${rel}: missing .course-content wrapper`);
    }
    if (!html.includes('site-home-bar')) {
        err(`${rel}: missing site-home-bar`);
    }
    if (rel.startsWith('hyperscale/') && !rel.endsWith('index.html')) {
        if (!html.includes('../../index.html') && !html.includes('../../../index.html')) {
            err(`${rel}: Hyperscale module should link to All tracks (../../index.html)`);
        }
    }

    const prefix = trackPrefix(rel);
    if (prefix) {
        const bodyClass = TRACK_BODY[prefix];
        if (!html.includes(`class="${bodyClass}"`)) {
            err(`${rel}: body must have class="${bodyClass}"`);
        }
        if (!html.includes('module-init.js')) {
            err(`${rel}: missing module-init.js`);
        }
        if (!html.includes('data-module-id=')) {
            err(`${rel}: missing data-module-id on module-init.js`);
        }
    } else if (!MODULE_INIT_EXEMPT.has(rel) && !isHub) {
        if (!html.includes('module-init.js')) {
            err(`${rel}: missing module-init.js (Hyperscale modules need it)`);
        }
    }

    if (!isHub) {
        for (const re of DEPRECATED_INLINE) {
            if (re.test(html)) {
                err(`${rel}: deprecated inline layout (run node scripts/normalize-module-pages.js)`);
                break;
            }
        }
        if (html.includes('flow-steps') && !html.includes('class="section"')) {
            err(`${rel}: flow-steps table should live inside .section`);
        }
    }
}

if (errors) {
    console.error(`\nmodule-page-contract: FAILED (${errors} error(s))`);
    process.exit(1);
}
console.log('\nmodule-page-contract: OK');
