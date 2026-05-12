#!/usr/bin/env node
/**
 * Contract tests for quiz result highlighting (wrong vs correct).
 * Run from repo root: node tests/test-quiz.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NAV_PATH = path.join(ROOT, 'common', 'navigation.js');
const CSS_PATH = path.join(ROOT, 'common', 'styles.css');

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

console.log('Quiz highlight contracts...\n');

const navJs = fs.readFileSync(NAV_PATH, 'utf8');
assert(
    navJs.includes("classList.add('incorrect')") || navJs.includes('classList.add("incorrect")'),
    'navigation.js adds .incorrect to wrong option'
);
assert(
    navJs.includes('question-wrong') &&
        (navJs.includes("classList.add('question-wrong')") || navJs.includes('classList.add("question-wrong")')),
    'navigation.js adds .question-wrong for wrong-answered questions'
);
assert(
    navJs.includes('isWrong') && (navJs.includes('userAnswer !== correctAnswer') || navJs.includes('userAnswer != correctAnswer')),
    'navigation.js computes isWrong for highlighting'
);

const css = fs.readFileSync(CSS_PATH, 'utf8');
assert(
    css.includes('.option.incorrect') && (css.includes('#fee2e2') || css.includes('var(--danger)')),
    'styles.css styles .option.incorrect'
);
assert(
    css.includes('.question-wrong') || css.includes('.question.question-wrong'),
    'styles.css styles wrong-question block'
);
assert(css.includes('.option.correct'), 'styles.css styles .option.correct');

if (failed > 0) {
    console.log('\n❌ ' + failed + ' check(s) failed.');
    process.exit(1);
}
console.log('\n✅ Quiz highlight checks passed.');
