#!/usr/bin/env node
/**
 * Glossary tooltip + expand link contracts.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GLOSSARY_JS = fs.readFileSync(path.join(ROOT, 'common/glossary.js'), 'utf8');

let failed = 0;
const err = (msg) => {
  console.error('  ❌', msg);
  failed++;
};
const ok = (msg) => console.log('  ✅', msg);

if (GLOSSARY_JS.includes("return '../glossary.html'")) {
  err('glossary.js must not return broken ../glossary.html for hyperscale-rs');
} else {
  ok('no legacy ../glossary.html path');
}

if (!GLOSSARY_JS.includes('new URL(\'glossary.html\', styleLink.href)')) {
  err('glossary.js should resolve glossary.html from styles.css base URL');
} else {
  ok('expand URL resolves from stylesheet link');
}

if (!GLOSSARY_JS.includes('glossaryTermAnchorId')) {
  err('glossary.js should use glossaryTermAnchorId for fragment ids');
} else {
  ok('shared glossaryTermAnchorId helper');
}

if (GLOSSARY_JS.includes('onclick="event.stopPropagation()"') && GLOSSARY_JS.includes('tooltip-expand')) {
  err('tooltip-expand should not use stopPropagation (blocks navigation in some cases)');
} else {
  ok('tooltip-expand link is a normal anchor');
}

const phase01 = fs.readFileSync(
  path.join(ROOT, 'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html'),
  'utf8'
);
if (!phase01.includes('../../common/styles.css')) {
  err('phase-01 should link styles via ../../common/styles.css');
} else {
  ok('hyperscale-rs module uses ../../common/styles.css');
}

if (failed > 0) {
  console.error(`\nglossary-contract: ${failed} failed\n`);
  process.exit(1);
}
console.log('\n✅ Glossary contract checks passed.\n');
