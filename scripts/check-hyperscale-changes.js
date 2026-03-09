#!/usr/bin/env node
/**
 * Check which hyperscale-rs paths changed (git diff) and which flow steps / teaching
 * modules are affected. Update the flow data in shared/hyperscale-flow-data.js first,
 * then run this to see which HTML modules to re-check.
 *
 * Usage:
 *   node scripts/check-hyperscale-changes.js [diff-target]
 *   node scripts/check-hyperscale-changes.js --save
 *
 *   diff-target: commit or branch to diff against. If omitted, uses the stored
 *   "last synced" commit (shared/hyperscale-rs-last-synced.txt) if present, else main.
 *   So after you pull hyperscale-rs, run once with no args to see changes since last
 *   recorded baseline; then run with --save to record current HEAD as the new baseline.
 *
 *   --save: write current hyperscale-rs HEAD to shared/hyperscale-rs-last-synced.txt
 *   and exit. Use after you've pulled and updated modules so the next run diffs
 *   against this commit.
 *
 *   Paths under vendor/ are ignored.
 *   LOCAL_REPO_PATH overrides clone path (default in scripts/hyperscale-repo.config.js).
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..');
const SHARED_DIR = path.join(REPO_ROOT, 'shared');
const FLOW_DATA_PATH = path.join(SHARED_DIR, 'hyperscale-flow-data.js');
const LAST_SYNCED_PATH = path.join(SHARED_DIR, 'hyperscale-rs-last-synced.txt');

const configPath = path.join(__dirname, 'hyperscale-repo.config.js');
const defaultRepoPath = fs.existsSync(configPath) ? require(configPath).DEFAULT_LOCAL_REPO_PATH : null;
const localRepoPath = process.env.LOCAL_REPO_PATH || defaultRepoPath;

const argv = process.argv.slice(2);
const saveBaseline = argv.includes('--save');
const diffTargetArg = argv.filter(a => a !== '--save')[0];
const diffTarget = diffTargetArg || (fs.existsSync(LAST_SYNCED_PATH) ? fs.readFileSync(LAST_SYNCED_PATH, 'utf8').trim() : '') || 'main';

function loadFlowData() {
    if (!fs.existsSync(FLOW_DATA_PATH)) {
        console.error('Missing shared/hyperscale-flow-data.js');
        process.exit(1);
    }
    // Load as Node module (the file sets module.exports when module is defined)
    return require(FLOW_DATA_PATH);
}

/** Paths under these prefixes are ignored (e.g. vendor/ submodule updates). */
const IGNORE_PREFIXES = ['vendor/'];

function getChangedFiles(repoPath, target) {
    try {
        const out = execSync(`git -C "${repoPath}" diff --name-only ${target}`, { encoding: 'utf8' });
        const all = out.trim() ? out.trim().split('\n') : [];
        return all.filter(p => !IGNORE_PREFIXES.some(prefix => p.startsWith(prefix)));
    } catch (e) {
        console.error(`Git diff failed (try a different target, e.g. HEAD~1): ${e.message}`);
        return [];
    }
}

function normalizePath(p) {
    return p.replace(/^\/+/, '').replace(/\\/g, '/');
}

function main() {
    if (!localRepoPath) {
        console.log('Usage: node scripts/check-hyperscale-changes.js [diff-target]');
        console.log('  Or set LOCAL_REPO_PATH=/path/to/hyperscale-rs');
        console.log('  Default path is in scripts/hyperscale-repo.config.js (edit if your clone is elsewhere).');
        console.log('');
        console.log('  diff-target: branch or commit to diff against (default: main)');
        console.log('');
        console.log('Set LOCAL_REPO_PATH or update DEFAULT_LOCAL_REPO_PATH in scripts/hyperscale-repo.config.js, then run again.');
        process.exit(1);
    }

    const resolvedRepo = path.resolve(REPO_ROOT, localRepoPath);
    if (!fs.existsSync(path.join(resolvedRepo, '.git'))) {
        console.error(`Not a git repo or not found: ${resolvedRepo}`);
        process.exit(1);
    }

    if (saveBaseline) {
        const head = execSync(`git -C "${resolvedRepo}" rev-parse HEAD`, { encoding: 'utf8' }).trim();
        fs.writeFileSync(LAST_SYNCED_PATH, head + '\n', 'utf8');
        console.log('Saved hyperscale-rs baseline:', head);
        console.log('Stored in', path.relative(REPO_ROOT, LAST_SYNCED_PATH));
        console.log('Next run with no diff-target will show changes since this commit.');
        return;
    }

    const flowData = loadFlowData();
    const changedFiles = getChangedFiles(resolvedRepo, diffTarget);
    if (changedFiles.length === 0) {
        console.log(`No changed files in hyperscale-rs since ${diffTarget}.`);
        console.log('To record current HEAD as baseline: node scripts/check-hyperscale-changes.js --save');
        return;
    }

    const normalizedChanged = new Set(changedFiles.map(normalizePath));
    const fileRefs = flowData.FILE_REFS || {};
    const moduleUsage = flowData.MODULE_USAGE || {};
    const crates = flowData.CRATES || {};
    const cratePaths = new Set(Object.values(crates));

    const affectedFileRefs = [];
    const affectedCrates = new Set();
    const affectedModules = new Set();

    for (const changed of normalizedChanged) {
        const ch = changed.replace(/\\/g, '/');
        if (fileRefs[ch]) {
            affectedFileRefs.push({ path: ch, note: fileRefs[ch].note || fileRefs[ch].lineHint });
            if (fileRefs[ch].note) {
                Object.keys(moduleUsage).forEach(flowId => {
                    if (flowId === 'file-refs-general' || flowId.includes('bft') || flowId.includes('tx-flow')) {
                        (moduleUsage[flowId] || []).forEach(m => affectedModules.add(m));
                    }
                });
            }
        }
        for (const [crateName, cratePath] of Object.entries(crates)) {
            if (ch === cratePath || ch.startsWith(cratePath + '/')) {
                affectedCrates.add(crateName);
                ['tx-flow', 'bft-single-shard', 'bft-multi-shard', 'bft-rust-internal', '2pc-flow', 'provision-flow', 'overview-flow-1', 'overview-flow-2', 'overview-flow-3', 'crate-groups'].forEach(flowId => {
                    (moduleUsage[flowId] || []).forEach(m => affectedModules.add(m));
                });
            }
        }
    }

    console.log('Hyperscale-rs changes since', diffTarget);
    console.log('Changed files (excluding vendor/):', changedFiles.length);
    console.log('');
    if (affectedFileRefs.length > 0) {
        console.log('Affected FILE_REFS (update shared/hyperscale-flow-data.js and check modules):');
        affectedFileRefs.forEach(({ path: p, note }) => console.log('  -', p, '→', note));
        console.log('');
    }
    if (affectedCrates.size > 0) {
        console.log('Affected crates (paths may have moved):', [...affectedCrates].join(', '));
        console.log('');
    }
    if (affectedModules.size > 0) {
        console.log('Teaching modules to re-check (links / crate paths / line refs):');
        [...affectedModules].sort().forEach(m => console.log('  -', m));
    } else if (affectedFileRefs.length === 0 && affectedCrates.size === 0) {
        console.log('No flow data references the changed files. No module updates required for flow/crate mapping.');
    }
    console.log('');
    console.log('To record current hyperscale-rs HEAD as baseline for next run: node scripts/check-hyperscale-changes.js --save');
}

main();
