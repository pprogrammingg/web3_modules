/**
 * Dynamic list of user-facing HTML pages (curriculum modules + hubs).
 * Used by module-page-contract.js and mobile-contract.js — keep in sync with course-data only.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const COMMON = path.join(ROOT, 'common');

const COURSE_DATA_FILES = [
    'course-data.js',
    'crypto-course-data.js',
    'zk-course-data.js',
    'evm-course-data.js'
];

const HUB_PAGES = [
    'index.html',
    'hyperscale/index.html',
    'solana-core/index.html',
    'crypto-fintech/index.html',
    'zk/index.html',
    'evm/index.html',
    'common/glossary.html'
];

function walkHtml(dirRel) {
    const abs = path.join(ROOT, dirRel);
    if (!fs.existsSync(abs)) return [];
    const out = [];
    for (const name of fs.readdirSync(abs)) {
        const rel = path.join(dirRel, name).split(path.sep).join('/');
        const p = path.join(ROOT, rel);
        if (fs.statSync(p).isDirectory()) out.push(...walkHtml(rel));
        else if (name.endsWith('.html')) out.push(rel);
    }
    return out;
}

function loadCurriculumModulePaths() {
    const paths = new Set();
    for (const file of COURSE_DATA_FILES) {
        const content = fs.readFileSync(path.join(COMMON, file), 'utf8');
        const re = /path:\s*'([^']+\.html)'/g;
        let m;
        while ((m = re.exec(content)) !== null) paths.add(m[1]);
    }
    for (const p of walkHtml('solana-core')) {
        if (!p.endsWith('index.html')) paths.add(p);
    }
    return [...paths].sort();
}

/** All pages that should be mobile-safe (modules + main hubs + landing). */
function loadLayoutPages() {
    return [...new Set([...HUB_PAGES, ...loadCurriculumModulePaths()])].sort();
}

module.exports = {
    ROOT,
    COMMON,
    COURSE_DATA_FILES,
    HUB_PAGES: new Set(HUB_PAGES),
    walkHtml,
    loadCurriculumModulePaths,
    loadLayoutPages
};
