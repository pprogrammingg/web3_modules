/**
 * Shared helpers: load BLOCK_EVOLUTION + parse hyperscale-rs BlockHeader / Block::Live.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');

function getHyperscaleRepoPath() {
  const cfg = require(path.join(ROOT, 'scripts/hyperscale-repo.config.js'));
  return path.resolve(ROOT, process.env.LOCAL_REPO_PATH || cfg.DEFAULT_LOCAL_REPO_PATH);
}

function loadBlockEvolution() {
  const code = fs.readFileSync(path.join(ROOT, 'common/block-evolution-data.js'), 'utf8');
  const sandbox = { global: {} };
  vm.runInNewContext(code, sandbox, { filename: 'block-evolution-data.js' });
  return sandbox.global.BLOCK_EVOLUTION || sandbox.BLOCK_EVOLUTION;
}

/** @param {string} source */
function parseStructFields(source, structName) {
  const re = new RegExp(`pub struct ${structName}[^{]*\\{([^}]+)\\}`, 's');
  const m = source.match(re);
  if (!m) return null;
  const fields = [];
  for (const line of m[1].split('\n')) {
    const fm = line.match(/^\s*(?:pub\s+)?(\w+)\s*:/);
    if (fm) fields.push(fm[1]);
  }
  return fields;
}

/** @param {string} source @param {string} variantName */
function parseEnumVariantFields(source, variantName) {
  const re = new RegExp(`${variantName}\\s*\\{([^}]+)\\}`, 's');
  const m = source.match(re);
  if (!m) return null;
  const fields = [];
  for (const line of m[1].split('\n')) {
    const fm = line.match(/^\s*(?:pub\s+)?(\w+)\s*:/);
    if (fm) fields.push(fm[1]);
  }
  return fields;
}

/** Teaching field id → rust field name in clone */
const FIELD_RUST_MAP = {
  shard_id: { location: 'header', rust: 'shard_id' },
  height: { location: 'header', rust: 'height' },
  parent_block_hash: { location: 'header', rust: 'parent_block_hash' },
  parent_qc: { location: 'header', rust: 'parent_qc' },
  proposer: { location: 'header', rust: 'proposer' },
  timestamp: { location: 'header', rust: 'timestamp' },
  round: { location: 'header', rust: 'round' },
  is_fallback: { location: 'header', rust: 'is_fallback' },
  state_root: { location: 'header', rust: 'state_root' },
  transaction_root: { location: 'header', rust: 'transaction_root' },
  certificate_root: { location: 'header', rust: 'certificate_root' },
  local_receipt_root: { location: 'header', rust: 'local_receipt_root' },
  provision_root: { location: 'header', rust: 'provision_root' },
  waves: { location: 'header', rust: 'waves' },
  provision_tx_roots: { location: 'header', rust: 'provision_tx_roots' },
  in_flight: { location: 'header', rust: 'in_flight' },
  beacon_witness_root: { location: 'header', rust: 'beacon_witness_root' },
  beacon_witness_leaf_count: { location: 'header', rust: 'beacon_witness_leaf_count' },
  beacon_witness_base: { location: 'header', rust: 'beacon_witness_base' },
  split_child_roots: { location: 'header', rust: 'split_child_roots' },
  settled_waves_root: { location: 'header', rust: 'settled_waves_root' },
  body_transactions: { location: 'body', rust: 'transactions' },
  body_certificates: { location: 'body', rust: 'certificates' },
  body_provisions: { location: 'body', rust: 'provisions' },
  body_ready_signals: { location: 'body', rust: 'ready_signals' },
  body_reshape_trigger: { location: 'body', rust: 'reshape_trigger' },
};

function loadGlossaryKeys() {
  const js = fs.readFileSync(path.join(ROOT, 'common/glossary.js'), 'utf8');
  const keys = new Set();
  const entryRe = /\{\s*key:\s*['"]([^'"]+)['"]/g;
  const aliasRe = /keys:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = entryRe.exec(js))) keys.add(m[1].toLowerCase());
  while ((m = aliasRe.exec(js))) {
    const inner = m[1];
    const itemRe = /['"]([^'"]+)['"]/g;
    let im;
    while ((im = itemRe.exec(inner))) keys.add(im[1].toLowerCase());
  }
  return keys;
}

module.exports = {
  ROOT,
  getHyperscaleRepoPath,
  loadBlockEvolution,
  parseStructFields,
  parseEnumVariantFields,
  FIELD_RUST_MAP,
  loadGlossaryKeys,
};
