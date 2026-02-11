#!/usr/bin/env node
/**
 * Tests for quiz result highlighting (wrong answers vs correct).
 * Run with: node test-quiz.js
 * Ensures wrong-answered questions and wrong-chosen options are highlighted,
 * not only the correct answer (so not "all green").
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const NAV_PATH = path.join(ROOT, 'shared', 'navigation.js');
const CSS_PATH = path.join(ROOT, 'shared', 'styles.css');

let failed = 0;

function assert(condition, message) {
    if (!condition) {
        console.error('  ❌ ' + message);
        failed++;
        return false;
    }
    console.log('  ✅ ' + message);
    return true;
}

console.log('🧪 Quiz highlight tests...\n');

// 1. navigation.js: must add 'incorrect' to wrong user choice
const navJs = fs.readFileSync(NAV_PATH, 'utf8');
assert(navJs.includes("classList.add('incorrect')") || navJs.includes('classList.add("incorrect")'), 'navigation.js adds .incorrect class to wrong option');
assert(navJs.includes('question-wrong') && (navJs.includes("classList.add('question-wrong')") || navJs.includes('classList.add("question-wrong")')), 'navigation.js adds .question-wrong to wrong-answered question container');
assert(navJs.includes('isWrong') && (navJs.includes('userAnswer !== correctAnswer') || navJs.includes('userAnswer != correctAnswer')), 'navigation.js computes isWrong for highlighting');

// 2. styles.css: must style incorrect option and wrong question block
const css = fs.readFileSync(CSS_PATH, 'utf8');
assert(css.includes('.option.incorrect') && (css.includes('#fee2e2') || css.includes('var(--danger')), 'styles.css styles .option.incorrect (red/wrong)');
assert(css.includes('.question-wrong') || css.includes('.question.question-wrong'), 'styles.css styles .question-wrong (highlight wrong-answered questions)');
assert(css.includes('.option.correct'), 'styles.css styles .option.correct (green/right)');

if (failed > 0) {
    console.log('\n❌ ' + failed + ' check(s) failed.');
    process.exit(1);
}
console.log('\n✅ All quiz highlight checks passed.');
process.exit(0);
