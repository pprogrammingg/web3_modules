#!/usr/bin/env node
/**
 * Block evolution teaching cards — data, glossary reuse, phase HTML mounts.
 * Run: node tests/block-evolution-contract.js
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  loadBlockEvolution,
  loadGlossaryKeys,
} = require('./lib/block-evolution-repo');

let failed = 0;
const err = (msg) => {
  console.error('  ❌', msg);
  failed++;
};
const ok = (msg) => console.log('  ✅', msg);

console.log('block-evolution-contract\n');

const data = loadBlockEvolution();
if (!data || !data.FIELDS || !data.STEPS || !data.SOURCE_PATHS) {
  err('BLOCK_EVOLUTION missing FIELDS, STEPS, or SOURCE_PATHS');
  process.exit(1);
}
ok('BLOCK_EVOLUTION loads via vm');

const glossaryKeys = loadGlossaryKeys();
const fieldIds = new Set(Object.keys(data.FIELDS));

for (const fid of data.HEADER_ORDER) {
  if (!fieldIds.has(fid)) err(`HEADER_ORDER references unknown field: ${fid}`);
}
for (const fid of data.BODY_ORDER) {
  if (!fieldIds.has(fid)) err(`BODY_ORDER references unknown field: ${fid}`);
}
ok('HEADER_ORDER and BODY_ORDER reference defined fields');

for (const [stepId, step] of Object.entries(data.STEPS)) {
  if (step.kind === 'block') {
    for (const fid of step.visibleFields || []) {
      if (!fieldIds.has(fid)) err(`step "${stepId}" visibleFields unknown: ${fid}`);
    }
    for (const fid of step.newFields || []) {
      if (!(step.visibleFields || []).includes(fid)) {
        err(`step "${stepId}" newField "${fid}" not in visibleFields`);
      }
    }
  }
}

for (const def of Object.values(data.FIELDS)) {
  const gk = (def.glossaryKey || '').toLowerCase();
  if (!glossaryKeys.has(gk)) {
    err(`FIELDS.${def.id} glossary alias missing in glossary.js: ${def.glossaryKey}`);
  }
}
ok('all field glossary keys resolve in glossary.js');

for (const def of Object.values(data.FIELDS)) {
  const gk = def.glossaryKey || '';
  if (!gk.startsWith('block-field-')) {
    err(`FIELDS.${def.id} must use block-field-* glossaryKey, got: ${gk}`);
  }
}
ok('all field glossary keys use block-field-* entries');

const txFlow = fs.readFileSync(
  path.join(ROOT, 'hyperscale/hyperscale-rs/module-01b-tx-flow.html'),
  'utf8'
);
if (!txFlow.includes('data-block-birdseye')) {
  err('module-01b-tx-flow.html: missing bird\'s-eye block anatomy table mount');
} else if (!txFlow.includes('block-evolution-data.js')) {
  err('module-01b-tx-flow.html: missing block-evolution scripts for bird\'s-eye table');
} else {
  ok('tx-flow module has bird\'s-eye block map');
}

if (!data.STEP_ORDER || data.STEP_ORDER.length < 8) {
  err('STEP_ORDER missing in block-evolution-data.js');
} else {
  for (const sid of data.STEP_ORDER) {
    if (!data.STEPS[sid]) err(`STEP_ORDER references unknown step: ${sid}`);
  }
  ok('STEP_ORDER aligns with STEPS');
}

if (!data.BIRDSEYE_ROWS || data.BIRDSEYE_ROWS.length < 10) {
  err('BIRDSEYE_ROWS missing or too short in block-evolution-data.js');
} else {
  for (const row of data.BIRDSEYE_ROWS) {
    if (row.blockStepId && !data.STEPS[row.blockStepId]) {
      err(`BIRDSEYE_ROWS references unknown blockStepId: ${row.blockStepId}`);
    }
  }
  ok(`BIRDSEYE_ROWS (${data.BIRDSEYE_ROWS.length} rows) align with STEPS`);
}

const phaseFiles = [
  'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html',
  'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
  'hyperscale/hyperscale-rs/module-phase-03-execution-waves.html',
  'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html',
];

const expectedMounts = {
  'module-phase-01-submit-to-mempool.html': ['pre-block'],
  'module-phase-02-propose-vote-commit.html': ['genesis', 'propose', 'parent-qc', 'commit'],
  'module-phase-03-execution-waves.html': ['waves-assigned', 'finalized-waves'],
  'module-phase-04-cross-shard-tx.html': ['provision-tx-roots', 'provisions-in-block'],
};

for (const rel of phaseFiles) {
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const base = path.basename(rel);
  if (!html.includes('block-evolution-data.js') || !html.includes('block-evolution.js')) {
    err(`${rel}: missing block-evolution script tags`);
  }
  if (!html.includes('glossary.js')) {
    err(`${rel}: glossary.js must load before block-evolution (shared tooltips)`);
  }
  for (const stepId of expectedMounts[base] || []) {
    if (!data.STEPS[stepId]) err(`contract expects unknown step: ${stepId}`);
    const needle = `data-block-evolution="${stepId}"`;
    if (!html.includes(needle)) err(`${rel}: missing mount ${needle}`);
  }
}
ok('phase 1–4 HTML mounts and scripts wired');

const beJs = fs.readFileSync(path.join(ROOT, 'common/block-evolution.js'), 'utf8');
if (!beJs.includes('initializeGlossary')) {
  err('block-evolution.js should wire hovers via initializeGlossary');
} else {
  ok('block-evolution reuses initializeGlossary');
}

const css = fs.readFileSync(path.join(ROOT, 'common/styles.css'), 'utf8');
for (const cls of ['.hs-block-card', '.hs-block-field--new', '.hs-block-field--seen']) {
  if (!css.includes(cls)) err(`styles.css missing ${cls}`);
}
ok('block card CSS present');

if (failed > 0) {
  console.error(`\nblock-evolution-contract: ${failed} failed\n`);
  process.exit(1);
}
console.log('\n✅ Block evolution contract checks passed.\n');
