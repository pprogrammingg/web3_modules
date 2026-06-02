#!/usr/bin/env node
/**
 * Ensures hyperscale teaching content matches the post-refactor hyperscale-rs layout
 * (shard/beacon crates, merged harness id). Run after pull + reflect workflow.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const HYPERSCALE_HTML = path.join(ROOT, 'hyperscale');
const REPO_CONFIG = path.join(ROOT, 'scripts/hyperscale-repo.config.js');
const FLOW_DATA = path.join(ROOT, 'common/hyperscale-flow-data.js');
const BASELINE = path.join(ROOT, 'common/hyperscale-rs-last-synced.txt');
const HYPERSCALE_CONFIG = path.join(ROOT, 'hyperscale-config.json');
const COURSE_DATA = path.join(ROOT, 'common/course-data.js');
const NAVIGATION = path.join(ROOT, 'common/navigation.js');

/** Removed ladder ids / symbols — must not appear in course-data or navigation. */
const STALE_IN_CURRICULUM = [
  { re: /['"]hs-sim-harness['"]/, label: 'hs-sim-harness id' },
  { re: /['"]hs-prod-e2e-harness['"]/, label: 'hs-prod-e2e-harness id' },
  { re: /['"]intermediate-04['"]/, label: 'intermediate-04 id' },
  { re: /run_pinned_loop/, label: 'run_pinned_loop (renamed run_shard_loop)' },
  { re: /data-crate="bft"/, label: 'data-crate="bft"' },
];

let failed = 0;
const err = (m) => {
  console.error('  ❌', m);
  failed++;
};
const ok = (m) => console.log('  ✅', m);

function walkHtml(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
}

/** Stale path/symbol patterns (exclude allowed historical "was crates/bft" in same file). */
const STALE_PATTERNS = [
  { re: /crates\/bft\//, label: 'crates/bft/ path' },
  { re: /\bbft\/src\//, label: 'bft/src/ path' },
  { re: /BftCoordinator/, label: 'BftCoordinator symbol' },
  { re: /hyperscale_bft::/, label: 'hyperscale_bft crate path' },
  { re: /data-crate="bft"/, label: 'data-crate="bft"' },
  { re: /data-crate="messages"/, label: 'removed messages crate' },
  { re: /data-module-id="hs-sim-harness"/, label: 'old hs-sim-harness id' },
  { re: /data-module-id="hs-prod-e2e-harness"/, label: 'old hs-prod-e2e-harness id' },
  { re: /data-module-id="intermediate-04"/, label: 'removed intermediate-04 id' },
  { re: /crates\/node\/src\/io_loop\//, label: 'io_loop path' },
  { re: /state\/bft\.rs/, label: 'state/bft.rs path' },
  { re: /self\.bft\b/, label: 'self.bft field' },
];

function lineAllowedStale(line) {
  if (/was\s+<code>crates\/bft<\/code>/.test(line)) return true;
  if (/was\s+`crates\/bft`/.test(line)) return true;
  if (/replaced the old `BftCoordinator`/.test(line)) return true;
  if (/\/ `crates\/bft`/.test(line)) return true;
  return false;
}

console.log('hyperscale-reflect-contract\n');

// 1) Baseline exists and repo matches
if (!fs.existsSync(BASELINE)) {
  err('missing common/hyperscale-rs-last-synced.txt — run reflect-changes.js hyperscale --save');
} else {
  const baseline = fs.readFileSync(BASELINE, 'utf8').trim();
  const cfg = require(REPO_CONFIG);
  const repo = path.resolve(ROOT, process.env.LOCAL_REPO_PATH || cfg.DEFAULT_LOCAL_REPO_PATH);
  if (!fs.existsSync(path.join(repo, '.git'))) {
    err(`hyperscale-rs clone not found: ${repo}`);
  } else {
    const head = execSync(`git -C "${repo}" rev-parse HEAD`, { encoding: 'utf8' }).trim();
    if (head !== baseline) {
      err(`clone HEAD ${head.slice(0, 8)} != baseline ${baseline.slice(0, 8)} — pull then reflect, or --save after edits`);
    } else {
      ok(`baseline matches clone HEAD (${head.slice(0, 8)})`);
    }
    if (!fs.existsSync(path.join(repo, 'crates/shard'))) err('clone missing crates/shard');
    else ok('crates/shard exists');
    if (!fs.existsSync(path.join(repo, 'crates/beacon'))) err('clone missing crates/beacon');
    else ok('crates/beacon exists');
    if (fs.existsSync(path.join(repo, 'crates/bft'))) err('clone still has crates/bft (unexpected)');
  }
}

// 2) FILE_REFS paths exist in clone
delete require.cache[require.resolve(FLOW_DATA)];
const flow = require(FLOW_DATA);
const cfg = require(REPO_CONFIG);
const repo = path.resolve(ROOT, process.env.LOCAL_REPO_PATH || cfg.DEFAULT_LOCAL_REPO_PATH);
const missingRefs = Object.keys(flow.FILE_REFS || {}).filter(
  (p) => !fs.existsSync(path.join(repo, p))
);
if (missingRefs.length) {
  missingRefs.forEach((p) => err(`FILE_REFS missing in clone: ${p}`));
} else {
  ok(`all ${Object.keys(flow.FILE_REFS).length} FILE_REFS paths exist in clone`);
}

// 2b) CRATES paths exist in clone
const missingCrates = Object.entries(flow.CRATES || {}).filter(
  ([, dir]) => !fs.existsSync(path.join(repo, dir))
);
if (missingCrates.length) {
  missingCrates.forEach(([name, dir]) => err(`CRATES.${name} missing in clone: ${dir}`));
} else {
  ok(`all ${Object.keys(flow.CRATES).length} CRATES paths exist in clone`);
}

// 2c) Maintainer config (AI / tooling) matches shard/beacon layout
if (fs.existsSync(HYPERSCALE_CONFIG)) {
  const cfg = JSON.parse(fs.readFileSync(HYPERSCALE_CONFIG, 'utf8'));
  const kc = cfg.codebase?.keyCrates || {};
  if (kc.bft) err('hyperscale-config.json still lists keyCrates.bft — use shard/beacon');
  else if (!kc.shard || !kc.beacon) err('hyperscale-config.json missing keyCrates.shard or keyCrates.beacon');
  else ok('hyperscale-config.json keyCrates includes shard + beacon');
} else {
  err('missing hyperscale-config.json');
}

// 3) Required modern symbols in key modules
const mustContain = [
  ['hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html', 'ShardCoordinator'],
  ['hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html', 'data-glossary="beacon chain"'],
  ['hyperscale/hyperscale-rs/module-hs-simulation-harness-analysis.html', 'data-module-id="hs-e2e-harness"'],
  ['common/navigation.js', "'hs-e2e-harness'"],
  ['common/course-data.js', "id: 'hs-e2e-harness'"],
];
for (const [rel, needle] of mustContain) {
  const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (!content.includes(needle)) err(`${rel} missing ${needle}`);
  else ok(`${rel} includes ${needle}`);
}

// 3b) Curriculum JS has no removed module ids or renamed APIs
for (const rel of [COURSE_DATA, NAVIGATION]) {
  const content = fs.readFileSync(rel, 'utf8');
  const relName = path.relative(ROOT, rel);
  let bad = false;
  for (const { re, label } of STALE_IN_CURRICULUM) {
    if (re.test(content)) {
      err(`${relName}: stale ${label}`);
      bad = true;
    }
  }
  if (!bad) ok(`${relName} has no removed module ids / run_pinned_loop`);
}

// 4) No stale patterns in hyperscale HTML
const htmlFiles = [];
walkHtml(HYPERSCALE_HTML, htmlFiles);
const staleHits = [];
for (const file of htmlFiles) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (lineAllowedStale(line)) return;
    for (const { re, label } of STALE_PATTERNS) {
      if (re.test(line)) staleHits.push({ file: path.relative(ROOT, file), line: i + 1, label, text: line.trim().slice(0, 100) });
    }
  });
}
if (staleHits.length) {
  staleHits.slice(0, 15).forEach((h) => err(`${h.file}:${h.line} ${h.label}: ${h.text}`));
  if (staleHits.length > 15) err(`... and ${staleHits.length - 15} more stale hits`);
} else {
  ok(`no stale bft/io_loop patterns in ${htmlFiles.length} hyperscale HTML files`);
}

// 5) reflect-changes reports clean when baseline matches
try {
  const out = execSync('node scripts/reflect-changes.js hyperscale', {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, LOCAL_REPO_PATH: repo },
  });
  if (!/No changed files in hyperscale-rs since/.test(out)) {
    err('reflect-changes.js hyperscale should report no changes when baseline matches HEAD');
    console.error(out.slice(0, 500));
  } else ok('reflect-changes.js reports in sync');
} catch (e) {
  err(`reflect-changes.js failed: ${e.message}`);
}

if (failed) {
  console.error(`\nhyperscale-reflect-contract: ${failed} failed\n`);
  process.exit(1);
}
console.log('\nhyperscale-reflect-contract: OK\n');
