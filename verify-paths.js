#!/usr/bin/env node
/**
 * Verification script for course module paths
 * Run with: node verify-paths.js
 */

const fs = require('fs');
const path = require('path');

const COURSES_DIR = __dirname;
const SHARED_DIR = path.join(COURSES_DIR, 'shared');

// Module files to check
const MODULES = [
    { file: 'basic/module-01-blockchain-fundamentals.html', id: 'basic-01' },
    { file: 'basic/module-02-consensus-basics.html', id: 'basic-02' },
    { file: 'basic/module-04-state-machines.html', id: 'basic-04' },
    { file: 'hyperscale-rs/module-01-overview.html', id: 'basic-05' },
];

// Required shared files
const SHARED_FILES = [
    'styles.css',
    'course-data.js',
    'navigation.js',
];

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

console.log('\nChecking module files...');

// Check each module
MODULES.forEach(({ file, id }) => {
    const modulePath = path.join(COURSES_DIR, file);
    console.log(`\n📄 ${file} (${id}):`);
    
    if (!fs.existsSync(modulePath)) {
        errors.push(`Module file missing: ${file}`);
        console.log(`  ❌ File does not exist`);
        return;
    }
    
    console.log(`  ✅ File exists`);
    
    const content = fs.readFileSync(modulePath, 'utf8');
    
    // Check CSS path
    const cssMatches = content.match(/href=["']([^"']*styles\.css[^"']*)["']/);
    if (cssMatches) {
        const cssPath = cssMatches[1];
        console.log(`  📝 CSS path: ${cssPath}`);
        
        // Determine expected path based on module location
        const expectedPath = file.includes('hyperscale-rs') 
            ? '../shared/styles.css' 
            : '../../shared/styles.css';
        
        if (cssPath === expectedPath) {
            console.log(`  ✅ CSS path is correct`);
        } else {
            warnings.push(`${file}: CSS path is '${cssPath}', expected '${expectedPath}'`);
            console.log(`  ⚠️  CSS path might be incorrect (expected: ${expectedPath})`);
        }
    } else {
        errors.push(`${file}: No CSS link found`);
        console.log(`  ❌ No CSS link found`);
    }
    
    // Check JS paths
    const jsMatches = content.matchAll(/src=["']([^"']*\.js[^"']*)["']/g);
    const jsPaths = Array.from(jsMatches).map(m => m[1]);
    
    if (jsPaths.length > 0) {
        console.log(`  📝 JS paths found: ${jsPaths.length}`);
        jsPaths.forEach(jsPath => {
            const expectedPath = file.includes('hyperscale-rs')
                ? jsPath.includes('course-data.js') ? '../shared/course-data.js' : '../shared/navigation.js'
                : jsPath.includes('course-data.js') ? '../../shared/course-data.js' : '../../shared/navigation.js';
            
            if (jsPath === expectedPath || jsPath.includes('shared/')) {
                console.log(`  ✅ ${path.basename(jsPath)} path is correct`);
            } else {
                warnings.push(`${file}: JS path '${jsPath}' might be incorrect`);
                console.log(`  ⚠️  ${path.basename(jsPath)} path might be incorrect`);
            }
        });
    } else {
        errors.push(`${file}: No JS scripts found`);
        console.log(`  ❌ No JS scripts found`);
    }
    
    // Check for required elements
    if (!content.includes('initializeModulePage')) {
        warnings.push(`${file}: Might be missing module initialization`);
    }
    
    if (!content.includes('initializeQuiz')) {
        warnings.push(`${file}: Might be missing quiz initialization`);
    }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All checks passed!');
    process.exit(0);
} else {
    if (errors.length > 0) {
        console.log(`\n❌ ERRORS (${errors.length}):`);
        errors.forEach(err => console.log(`   - ${err}`));
    }
    
    if (warnings.length > 0) {
        console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
        warnings.forEach(warn => console.log(`   - ${warn}`));
    }
    
    process.exit(errors.length > 0 ? 1 : 0);
}