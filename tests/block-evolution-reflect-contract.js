#!/usr/bin/env node
/**
 * Block evolution vs hyperscale-rs clone (source of truth).
 * Run after pull + reflect: node tests/block-evolution-reflect-contract.js
 *
 * Compares BlockHeader + Block::Live fields in the clone against
 * common/block-evolution-data.js teaching model.
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  getHyperscaleRepoPath,
  loadBlockEvolution,
  parseStructFields,
  parseEnumVariantFields,
  FIELD_RUST_MAP,
} = require('./lib/block-evolution-repo');

let failed = 0;
const err = (msg) => {
  console.error('  ❌', msg);
  failed++;
};
const ok = (msg) => console.log('  ✅', msg);
const warn = (msg) => console.warn('  ⚠️ ', msg);

console.log('block-evolution-reflect-contract\n');

const data = loadBlockEvolution();
if (!data || !data.SOURCE_PATHS) {
  err('BLOCK_EVOLUTION or SOURCE_PATHS missing');
  process.exit(1);
}

const repo = getHyperscaleRepoPath();
if (!fs.existsSync(path.join(repo, '.git'))) {
  err(`hyperscale-rs clone not found: ${repo}`);
  console.error('\nSet LOCAL_REPO_PATH or clone per scripts/hyperscale-repo.config.js\n');
  process.exit(1);
}
ok(`clone: ${repo}`);

const headerPath = path.join(repo, data.SOURCE_PATHS.blockHeader);
const bodyPath = path.join(repo, data.SOURCE_PATHS.blockBody);
if (!fs.existsSync(headerPath)) {
  err(`missing ${data.SOURCE_PATHS.blockHeader} in clone`);
} else {
  ok(`found ${data.SOURCE_PATHS.blockHeader}`);
}
if (!fs.existsSync(bodyPath)) {
  err(`missing ${data.SOURCE_PATHS.blockBody} in clone`);
} else {
  ok(`found ${data.SOURCE_PATHS.blockBody}`);
}

if (failed) {
  console.error(`\nblock-evolution-reflect-contract: ${failed} failed\n`);
  process.exit(1);
}

const headerSrc = fs.readFileSync(headerPath, 'utf8');
const bodySrc = fs.readFileSync(bodyPath, 'utf8');
const headerFields = parseStructFields(headerSrc, 'BlockHeader');
const liveFields = parseEnumVariantFields(bodySrc, data.SOURCE_PATHS.blockLiveVariant || 'Live');

if (!headerFields || !headerFields.length) {
  err('could not parse BlockHeader fields from header.rs');
} else {
  ok(`parsed BlockHeader (${headerFields.length} fields)`);
}
if (!liveFields || !liveFields.length) {
  err('could not parse Block::Live fields from block.rs');
} else {
  ok(`parsed Block::Live (${liveFields.length} fields)`);
}

const headerSet = new Set(headerFields || []);
const liveSet = new Set(liveFields || []);

const taughtHeader = new Set(data.HEADER_ORDER);
const taughtBody = new Set(data.BODY_ORDER);
const allTaught = new Set([...taughtHeader, ...taughtBody]);

for (const fid of data.HEADER_ORDER) {
  const map = FIELD_RUST_MAP[fid];
  if (!map || map.location !== 'header') {
    err(`FIELD_RUST_MAP missing header mapping for ${fid}`);
    continue;
  }
  if (!headerSet.has(map.rust)) {
    err(`clone BlockHeader missing taught field ${map.rust} (teaching id ${fid})`);
  }
}

for (const fid of data.BODY_ORDER) {
  const map = FIELD_RUST_MAP[fid];
  if (!map || map.location !== 'body') {
    err(`FIELD_RUST_MAP missing body mapping for ${fid}`);
    continue;
  }
  if (!liveSet.has(map.rust)) {
    err(`clone Block::Live missing taught field ${map.rust} (teaching id ${fid})`);
  }
}
ok('all taught HEADER_ORDER + BODY_ORDER fields exist in clone');

const unmappedTaught = Object.keys(data.FIELDS).filter((id) => !FIELD_RUST_MAP[id]);
if (unmappedTaught.length) {
  unmappedTaught.forEach((id) => err(`FIELDS.${id} has no FIELD_RUST_MAP entry`));
} else {
  ok('FIELD_RUST_MAP covers every FIELDS entry');
}

const extraHeader = headerFields.filter((f) => {
  const taught = Object.entries(FIELD_RUST_MAP).find(
    ([, m]) => m.location === 'header' && m.rust === f
  );
  return !taught;
});
const extraLive = liveFields.filter((f) => {
  if (f === 'header') return false;
  const taught = Object.entries(FIELD_RUST_MAP).find(
    ([, m]) => m.location === 'body' && m.rust === f
  );
  return !taught;
});

if (extraHeader.length) {
  warn(
    `clone BlockHeader has fields not in block-evolution-data.js: ${extraHeader.join(', ')} — update teaching cards after reflect`
  );
}
if (extraLive.length) {
  warn(
    `clone Block::Live has fields not taught: ${extraLive.join(', ')} — update block-evolution-data.js if users need them`
  );
}

const baselinePath = path.join(ROOT, 'common/hyperscale-rs-last-synced.txt');
if (fs.existsSync(baselinePath)) {
  const baseline = fs.readFileSync(baselinePath, 'utf8').trim();
  const { execSync } = require('child_process');
  const head = execSync(`git -C "${repo}" rev-parse HEAD`, { encoding: 'utf8' }).trim();
  if (head !== baseline) {
    warn(
      `clone HEAD ${head.slice(0, 8)} != baseline ${baseline.slice(0, 8)} — run reflect-changes.js hyperscale after updating block evolution`
    );
  } else {
    ok(`clone HEAD matches baseline (${head.slice(0, 8)})`);
  }
}

if (failed > 0) {
  console.error(`\nblock-evolution-reflect-contract: ${failed} failed\n`);
  process.exit(1);
}
console.log('\n✅ Block evolution reflect contract checks passed.\n');
