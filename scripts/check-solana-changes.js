#!/usr/bin/env node
/**
 * Diff the local Solana monorepo (git) and list changed paths. Use this after pulling
 * solana to see what may affect Solana Core web modules — same workflow pattern as
 * scripts/check-hyperscale-changes.js, without crate/flow mapping until FILE_REFS exist.
 *
 * Usage:
 *   node scripts/check-solana-changes.js [diff-target]
 *   node scripts/check-solana-changes.js --save
 *
 *   diff-target: commit or branch to diff against. If omitted, uses
 *   common/solana-last-synced.txt if present, else main.
 *
 *   --save: write current Solana repo HEAD to common/solana-last-synced.txt
 *
 *   LOCAL_REPO_PATH or scripts/solana-repo.config.js DEFAULT_LOCAL_REPO_PATH.
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..');
const COMMON_DIR = path.join(REPO_ROOT, 'common');
const LAST_SYNCED_PATH = path.join(COMMON_DIR, 'solana-last-synced.txt');

const configPath = path.join(__dirname, 'solana-repo.config.js');
const defaultRepoPath = fs.existsSync(configPath) ? require(configPath).DEFAULT_LOCAL_REPO_PATH : null;
const localRepoPath = process.env.LOCAL_REPO_PATH || defaultRepoPath;

const argv = process.argv.slice(2);
const saveBaseline = argv.includes('--save');
const diffTargetArg = argv.filter(a => a !== '--save')[0];
const diffTarget =
    diffTargetArg ||
    (fs.existsSync(LAST_SYNCED_PATH) ? fs.readFileSync(LAST_SYNCED_PATH, 'utf8').trim() : '') ||
    'main';

/** Simple map: path prefix → Solana Core HTML to re-read when that area moves (extend as you add modules). */
const PREFIX_HINTS = [
    { prefix: 'ledger/', hint: 'solana-core modules touching ledger / accounts DB' },
    { prefix: 'runtime/', hint: 'solana-core execution / BPF modules' },
    { prefix: 'core/', hint: 'solana-core consensus / banking modules' },
    { prefix: 'gossip/', hint: 'solana-core gossip / cluster modules' },
];

function getChangedFiles(repoPath, target) {
    try {
        const out = execSync(`git -C "${repoPath}" diff --name-only ${target}`, { encoding: 'utf8' });
        return out.trim() ? out.trim().split('\n') : [];
    } catch (e) {
        console.error(`Git diff failed: ${e.message}`);
        return [];
    }
}

function main() {
    if (!localRepoPath) {
        console.log('Set LOCAL_REPO_PATH or edit scripts/solana-repo.config.js (DEFAULT_LOCAL_REPO_PATH).');
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
        console.log('Saved Solana baseline:', head);
        console.log('Stored in', path.relative(REPO_ROOT, LAST_SYNCED_PATH));
        return;
    }

    const changedFiles = getChangedFiles(resolvedRepo, diffTarget);
    console.log('Solana repo changes since', diffTarget);
    console.log('Changed files:', changedFiles.length);
    changedFiles.forEach(f => console.log('  -', f));

    const hints = new Set();
    for (const f of changedFiles) {
        for (const { prefix, hint } of PREFIX_HINTS) {
            if (f.startsWith(prefix)) hints.add(hint);
        }
    }
    if (hints.size) {
        console.log('\nAreas to consider when updating solana-core/*.html:');
        [...hints].forEach(h => console.log('  ·', h));
    }

    console.log('\nAfter updating modules: node scripts/check-solana-changes.js --save');
}

main();
