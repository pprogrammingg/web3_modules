#!/usr/bin/env node
/**
 * Verification script for course module paths.
 * Module lists are derived from common/course-data.js, common/crypto-course-data.js, common/zk-course-data.js, and common/evm-course-data.js.
 * Run with: node verify-paths.js
 */

const fs = require('fs');
const path = require('path');

const COURSES_DIR = __dirname;
const COMMON_DIR = path.join(COURSES_DIR, 'common');

// Required common files (existence check)
const COMMON_FILES = [
    'styles.css',
    'ensure-styles.js',
    'course-data.js',
    'crypto-course-data.js',
    'zk-course-data.js',
    'evm-course-data.js',
    'navigation.js',
    'crypto-navigation.js',
    'zk-navigation.js',
    'evm-navigation.js',
    'glossary.js',
    'module-init.js',
    'rust-highlight.js',
    'hyperscale-flow-data.js',
    'hyperscale-links.js',
    'block-evolution-data.js',
    'block-evolution.js',
];

// Derive module list from course-data.js so we don't duplicate it
function loadModulesFromCourseData() {
    const courseDataPath = path.join(COMMON_DIR, 'course-data.js');
    const content = fs.readFileSync(courseDataPath, 'utf8');
    const regex = /id:\s*'([^']+)'[\s\S]*?path:\s*'([^']+)'/g;
    const modules = [];
    let m;
    while ((m = regex.exec(content)) !== null) {
        modules.push({ id: m[1], file: m[2] });
    }
    return modules;
}

function loadModulesFromCryptoCourseData() {
    const p = path.join(COMMON_DIR, 'crypto-course-data.js');
    if (!fs.existsSync(p)) return [];
    const content = fs.readFileSync(p, 'utf8');
    const regex = /id:\s*'([^']+)'[\s\S]*?path:\s*'([^']+)'/g;
    const modules = [];
    let m;
    while ((m = regex.exec(content)) !== null) {
        modules.push({ id: m[1], file: m[2] });
    }
    return modules;
}

function loadModulesFromZkCourseData() {
    const p = path.join(COMMON_DIR, 'zk-course-data.js');
    if (!fs.existsSync(p)) return [];
    const content = fs.readFileSync(p, 'utf8');
    const regex = /id:\s*'([^']+)'[\s\S]*?path:\s*'([^']+)'/g;
    const modules = [];
    let m;
    while ((m = regex.exec(content)) !== null) {
        modules.push({ id: m[1], file: m[2] });
    }
    return modules;
}

function loadModulesFromEvmCourseData() {
    const p = path.join(COMMON_DIR, 'evm-course-data.js');
    if (!fs.existsSync(p)) return [];
    const content = fs.readFileSync(p, 'utf8');
    const regex = /id:\s*'([^']+)'[\s\S]*?path:\s*'([^']+)'/g;
    const modules = [];
    let m;
    while ((m = regex.exec(content)) !== null) {
        modules.push({ id: m[1], file: m[2] });
    }
    return modules;
}

// Expected CSS path from module file path (e.g. hyperscale/basic/foo.html -> ../../common/)
function expectedCssPathFor(moduleFile) {
    const dir = path.dirname(moduleFile);
    if (!dir || dir === '.') return 'common/styles.css';
    const depth = dir.split(path.sep).length;
    return '../'.repeat(depth) + 'common/styles.css';
}

const COMMON_JS = [
    'ensure-styles.js',
    'course-data.js',
    'crypto-course-data.js',
    'zk-course-data.js',
    'evm-course-data.js',
    'navigation.js',
    'crypto-navigation.js',
    'zk-navigation.js',
    'evm-navigation.js',
    'glossary.js',
    'module-init.js',
    'rust-highlight.js',
    'hyperscale-flow-data.js',
    'hyperscale-links.js',
    'block-evolution-data.js',
    'block-evolution.js',
];
const VALID_JS_PATHS = [
    ...COMMON_JS.map(f => `common/${f}`),
    ...COMMON_JS.map(f => `../common/${f}`),
    ...COMMON_JS.map(f => `../../common/${f}`),
];

let errors = [];
let warnings = [];

console.log('🔍 Verifying course module paths...\n');

// Check common files exist
console.log('Checking common/ assets...');
COMMON_FILES.forEach(file => {
    const filePath = path.join(COMMON_DIR, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        errors.push(`Missing common file: ${file}`);
        console.log(`  ❌ ${file} - MISSING`);
    }
});

const MODULES = loadModulesFromCourseData()
    .concat(loadModulesFromCryptoCourseData())
    .concat(loadModulesFromZkCourseData())
    .concat(loadModulesFromEvmCourseData());
console.log(
    `\nLoaded ${MODULES.length} modules from course-data.js + crypto-course-data.js + zk-course-data.js + evm-course-data.js\nChecking module files...`
);

MODULES.forEach(({ id, file }) => {
    const modulePath = path.join(COURSES_DIR, file);
    console.log(`\n📄 ${file} (${id}):`);

    if (!fs.existsSync(modulePath)) {
        console.log(`  ⏭️  Skipped (no HTML file yet)`);
        return;
    }

    console.log(`  ✅ File exists`);

    const content = fs.readFileSync(modulePath, 'utf8');
    const expectedCss = expectedCssPathFor(file);

    const cssMatches = content.match(/href=["']([^"']*styles\.css[^"']*)["']/);
    if (cssMatches) {
        const cssPath = cssMatches[1];
        console.log(`  📝 CSS path: ${cssPath}`);
        if (cssPath === expectedCss) {
            console.log(`  ✅ CSS path is correct`);
        } else {
            warnings.push(`${file}: CSS path is '${cssPath}', expected '${expectedCss}'`);
            console.log(`  ⚠️  CSS path might be incorrect (expected: ${expectedCss})`);
        }
    } else {
        errors.push(`${file}: No CSS link found`);
        console.log(`  ❌ No CSS link found`);
    }

    const jsMatches = content.matchAll(/src=["']([^"']*\.js[^"']*)["']/g);
    const jsPaths = Array.from(jsMatches).map(m => m[1]);

    if (jsPaths.length > 0) {
        console.log(`  📝 JS paths found: ${jsPaths.length}`);
        jsPaths.forEach(jsPath => {
            const isCommon = VALID_JS_PATHS.includes(jsPath);
            const isSameDir = !jsPath.startsWith('..') && jsPath.endsWith('.js');
            if (isCommon || isSameDir) {
                console.log(`  ✅ ${path.basename(jsPath)} path is correct`);
            } else {
                warnings.push(`${file}: JS path '${jsPath}' might be incorrect (expected one of: ${VALID_JS_PATHS.join(', ')} or same-dir .js)`);
                console.log(`  ⚠️  ${path.basename(jsPath)} path might be incorrect`);
            }
        });
    } else {
        errors.push(`${file}: No JS scripts found`);
        console.log(`  ❌ No JS scripts found`);
    }

    if (!content.includes('initializeModulePage') && !content.includes('module-init.js')) {
        warnings.push(`${file}: Might be missing module initialization`);
    }

    // Resolve stylesheet path and verify target exists (prevents broken styling when opening from links)
    if (cssMatches) {
        const moduleDir = path.dirname(file);
        const resolvedCss = path.normalize(path.join(COURSES_DIR, moduleDir, cssMatches[1]));
        if (path.relative(COURSES_DIR, resolvedCss).startsWith('..')) {
            errors.push(`${file}: Resolved stylesheet path escapes repo: ${resolvedCss}`);
        } else if (!fs.existsSync(resolvedCss)) {
            errors.push(`${file}: Resolved stylesheet does not exist: ${path.relative(COURSES_DIR, resolvedCss)}`);
        }
    }

    // Resolve each internal .html link and verify target exists (prevents 404 / unstyled pages)
    const htmlLinkRegex = /<a[^>]+href=["']([^"']*\.html[^"']*)["']/gi;
    let linkMatch;
    while ((linkMatch = htmlLinkRegex.exec(content)) !== null) {
        let href = linkMatch[1];
        if (href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) continue;
        const pathOnly = href.replace(/#.*$/, '').replace(/\?.*$/, '');
        const moduleDir = path.dirname(file);
        const resolved = path.normalize(path.join(COURSES_DIR, moduleDir, pathOnly));
        const rel = path.relative(COURSES_DIR, resolved);
        if (rel.startsWith('..')) continue; // external or outside repo
        if (!fs.existsSync(resolved)) {
            errors.push(`${file}: Link target does not exist: ${href} → ${rel}`);
        }
    }
});

// Summary
const SEP = '='.repeat(60);
console.log('\n' + SEP);
console.log('SUMMARY');
console.log(SEP);

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All checks passed!');
    process.exit(0);
}

if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach(err => console.log(`   - ${err}`));
}
if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(warn => console.log(`   - ${warn}`));
}

process.exit(errors.length > 0 ? 1 : 0);
