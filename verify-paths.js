#!/usr/bin/env node
/**
 * Verification script for course module paths.
 * Module list is derived from shared/course-data.js (single source of truth).
 * Run with: node verify-paths.js
 */

const fs = require('fs');
const path = require('path');

const COURSES_DIR = __dirname;
const SHARED_DIR = path.join(COURSES_DIR, 'shared');

// Required shared files (existence check)
const SHARED_FILES = [
    'styles.css',
    'course-data.js',
    'navigation.js',
    'glossary.js',
];

// Derive module list from course-data.js so we don't duplicate it
function loadModulesFromCourseData() {
    const courseDataPath = path.join(SHARED_DIR, 'course-data.js');
    const content = fs.readFileSync(courseDataPath, 'utf8');
    const regex = /id:\s*'([^']+)'[\s\S]*?path:\s*'([^']+)'/g;
    const modules = [];
    let m;
    while ((m = regex.exec(content)) !== null) {
        modules.push({ id: m[1], file: m[2] });
    }
    return modules;
}

// Expected CSS path from module file path (e.g. basic/foo.html -> ../shared/, intermediate/bar.html -> ../shared/)
function expectedCssPathFor(moduleFile) {
    const dir = path.dirname(moduleFile);
    if (!dir || dir === '.') return 'shared/styles.css';
    const depth = dir.split(path.sep).length;
    return '../'.repeat(depth) + 'shared/styles.css';
}

const VALID_JS_PATHS = ['../shared/course-data.js', '../shared/navigation.js', '../shared/glossary.js'];

let errors = [];
let warnings = [];

console.log('🔍 Verifying course module paths...\n');

// Check shared files exist
console.log('Checking shared files...');
SHARED_FILES.forEach(file => {
    const filePath = path.join(SHARED_DIR, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        errors.push(`Missing shared file: ${file}`);
        console.log(`  ❌ ${file} - MISSING`);
    }
});

const MODULES = loadModulesFromCourseData();
console.log(`\nLoaded ${MODULES.length} modules from course-data.js\nChecking module files...`);

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
            const isShared = VALID_JS_PATHS.includes(jsPath);
            const isSameDir = !jsPath.startsWith('..') && jsPath.endsWith('.js');
            if (isShared || isSameDir) {
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

    if (!content.includes('initializeModulePage')) {
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
