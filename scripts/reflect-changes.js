#!/usr/bin/env node
/**
 * Reflect upstream repo changes into this course: git diff → what to re-check / update.
 *
 * Usage:
 *   node scripts/reflect-changes.js hyperscale [--save] [diff-target]
 *   node scripts/reflect-changes.js solana-core [--save] [diff-target]
 *
 * Aliases: hyperscale-rs → hyperscale; solana → solana-core
 *
 * diff-target: commit or branch (default: last-synced file in common/, else main)
 * --save: write current upstream HEAD to the track's baseline file and exit
 *
 * Clone paths: scripts/hyperscale-repo.config.js | scripts/solana-repo.config.js
 * Override: LOCAL_REPO_PATH=/abs/path (applies to whichever track you run)
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..');
const COMMON_DIR = path.join(REPO_ROOT, 'common');

const TRACKS = {
    hyperscale: {
        label: 'hyperscale-rs',
        configPath: path.join(__dirname, 'hyperscale-repo.config.js'),
        lastSyncedPath: path.join(COMMON_DIR, 'hyperscale-rs-last-synced.txt'),
        flowDataPath: path.join(COMMON_DIR, 'hyperscale-flow-data.js'),
        ignorePrefixes: ['vendor/'],
        run: runHyperscale,
    },
    'solana-core': {
        label: 'Solana monorepo',
        configPath: path.join(__dirname, 'solana-repo.config.js'),
        lastSyncedPath: path.join(COMMON_DIR, 'solana-last-synced.txt'),
        prefixHints: [
            { prefix: 'ledger/', hint: 'solana-core modules touching ledger / accounts DB' },
            { prefix: 'runtime/', hint: 'solana-core execution / BPF modules' },
            { prefix: 'core/', hint: 'solana-core consensus / banking modules' },
            { prefix: 'gossip/', hint: 'solana-core gossip / cluster modules' },
        ],
        run: runSolanaCore,
    },
};

function normalizeTrackId(raw) {
    if (!raw) return null;
    const s = String(raw).toLowerCase().trim();
    if (s === 'hyperscale' || s === 'hyperscale-rs') return 'hyperscale';
    if (s === 'solana-core' || s === 'solana') return 'solana-core';
    return null;
}

function parseArgs(argv) {
    const saveBaseline = argv.includes('--save');
    const rest = argv.filter(a => a !== '--save');
    const diffTargetArg = rest.find(a => !a.startsWith('-')) || null;
    return { saveBaseline, diffTargetArg };
}

function resolveRepo(configPath) {
    const defaultRepoPath =
        fs.existsSync(configPath) ? require(configPath).DEFAULT_LOCAL_REPO_PATH : null;
    const localRepoPath = process.env.LOCAL_REPO_PATH || defaultRepoPath;
    if (!localRepoPath) return { localRepoPath: null, resolvedRepo: null };
    const resolvedRepo = path.resolve(REPO_ROOT, localRepoPath);
    return { localRepoPath, resolvedRepo };
}

function assertGitRepo(resolvedRepo) {
    if (!fs.existsSync(path.join(resolvedRepo, '.git'))) {
        console.error(`Not a git repo or not found: ${resolvedRepo}`);
        process.exit(1);
    }
}

function getChangedFiles(repoPath, target, ignorePrefixes) {
    try {
        const out = execSync(`git -C "${repoPath}" diff --name-only ${target}`, { encoding: 'utf8' });
        const all = out.trim() ? out.trim().split('\n') : [];
        if (!ignorePrefixes || !ignorePrefixes.length) return all;
        return all.filter(p => !ignorePrefixes.some(prefix => p.startsWith(prefix)));
    } catch (e) {
        console.error(`Git diff failed (try a different target, e.g. HEAD~1): ${e.message}`);
        return [];
    }
}

function normalizePath(p) {
    return p.replace(/^\/+/, '').replace(/\\/g, '/');
}

function saveBaseline(resolvedRepo, lastSyncedPath, label) {
    const head = execSync(`git -C "${resolvedRepo}" rev-parse HEAD`, { encoding: 'utf8' }).trim();
    fs.writeFileSync(lastSyncedPath, head + '\n', 'utf8');
    console.log(`Saved ${label} baseline:`, head);
    console.log('Stored in', path.relative(REPO_ROOT, lastSyncedPath));
    console.log('Next run with no diff-target will show changes since this commit.');
}

function loadFlowData(flowDataPath) {
    if (!fs.existsSync(flowDataPath)) {
        console.error('Missing', path.relative(REPO_ROOT, flowDataPath));
        process.exit(1);
    }
    return require(flowDataPath);
}

function runHyperscale(track, resolvedRepo, diffTarget, saveBaselineFlag) {
    const { lastSyncedPath, flowDataPath, ignorePrefixes } = track;

    if (saveBaselineFlag) {
        saveBaseline(resolvedRepo, lastSyncedPath, 'hyperscale-rs');
        return;
    }

    const flowData = loadFlowData(flowDataPath);
    const changedFiles = getChangedFiles(resolvedRepo, diffTarget, ignorePrefixes);
    if (changedFiles.length === 0) {
        console.log(`No changed files in hyperscale-rs since ${diffTarget}.`);
        console.log('To record current HEAD as baseline: node scripts/reflect-changes.js hyperscale --save');
        return;
    }

    const normalizedChanged = new Set(changedFiles.map(normalizePath));
    const fileRefs = flowData.FILE_REFS || {};
    const moduleUsage = flowData.MODULE_USAGE || {};
    const crates = flowData.CRATES || {};

    const affectedFileRefs = [];
    const affectedCrates = new Set();
    const affectedModules = new Set();

    for (const changed of normalizedChanged) {
        const ch = changed.replace(/\\/g, '/');
        if (fileRefs[ch]) {
            affectedFileRefs.push({ path: ch, note: fileRefs[ch].note || fileRefs[ch].lineHint });
            (moduleUsage['file-refs-general'] || []).forEach(m => affectedModules.add(m));
            const note = (fileRefs[ch].note || '').toLowerCase();
            Object.keys(moduleUsage).forEach(flowId => {
                if (flowId === 'file-refs-general') return;
                const match =
                    (note.includes('bft') && flowId.includes('bft')) ||
                    (note.includes('tx') && flowId.includes('tx-flow')) ||
                    (note.includes('messaging') && flowId === 'tx-flow') ||
                    (note.includes('cross-shard') && (flowId.includes('provision') || flowId.includes('2pc'))) ||
                    (note.includes('overview') && flowId.startsWith('overview-flow')) ||
                    (note.includes('e2e') && flowId === 'tx-flow') ||
                    (note.includes('perf') && flowId === 'rust-optimization-module') ||
                    (note.includes('simulator') && (flowId === 'tx-flow' || flowId === 'rust-optimization-module'));
                if (match) {
                    (moduleUsage[flowId] || []).forEach(m => affectedModules.add(m));
                }
            });
        }
        for (const [crateName, cratePath] of Object.entries(crates)) {
            if (ch === cratePath || ch.startsWith(cratePath + '/')) {
                affectedCrates.add(crateName);
                [
                    'tx-flow',
                    'bft-single-shard',
                    'bft-multi-shard',
                    'bft-rust-internal',
                    '2pc-flow',
                    'provision-flow',
                    'overview-flow-1',
                    'overview-flow-2',
                    'overview-flow-3',
                    'crate-groups',
                    'rust-optimization-module',
                ].forEach(flowId => {
                    (moduleUsage[flowId] || []).forEach(m => affectedModules.add(m));
                });
            }
        }
    }

    console.log('Hyperscale-rs changes since', diffTarget);
    console.log('Changed files (excluding vendor/):', changedFiles.length);
    console.log('');
    if (affectedFileRefs.length > 0) {
        console.log('Affected FILE_REFS (update common/hyperscale-flow-data.js and check modules):');
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
    console.log(
        'To record current hyperscale-rs HEAD as baseline: node scripts/reflect-changes.js hyperscale --save'
    );
}

function runSolanaCore(track, resolvedRepo, diffTarget, saveBaselineFlag) {
    const { lastSyncedPath, prefixHints } = track;

    if (saveBaselineFlag) {
        saveBaseline(resolvedRepo, lastSyncedPath, 'Solana');
        return;
    }

    const changedFiles = getChangedFiles(resolvedRepo, diffTarget, null);
    console.log('Solana repo changes since', diffTarget);
    console.log('Changed files:', changedFiles.length);
    changedFiles.forEach(f => console.log('  -', f));

    const hints = new Set();
    for (const f of changedFiles) {
        for (const { prefix, hint } of prefixHints) {
            if (f.startsWith(prefix)) hints.add(hint);
        }
    }
    if (hints.size) {
        console.log('\nAreas to consider when updating solana-core/*.html:');
        [...hints].forEach(h => console.log('  ·', h));
    }

    console.log('\nAfter updating modules: node scripts/reflect-changes.js solana-core --save');
}

function printUsage() {
    console.log('Reflect upstream git changes → course update hints.\n');
    console.log('Usage:');
    console.log('  node scripts/reflect-changes.js hyperscale [--save] [diff-target]');
    console.log('  node scripts/reflect-changes.js solana-core [--save] [diff-target]');
    console.log('');
    console.log('Aliases: hyperscale-rs, solana');
    console.log('');
    console.log('Clone paths: scripts/hyperscale-repo.config.js | scripts/solana-repo.config.js');
    console.log('Override both tracks: LOCAL_REPO_PATH=/path/to/repo');
    console.log('');
    console.log('Legacy wrappers (same behavior):');
    console.log('  node scripts/check-hyperscale-changes.js …');
    console.log('  node scripts/check-solana-changes.js …');
}

function main(argv) {
    const trackId = normalizeTrackId(argv[0]);
    if (!trackId) {
        printUsage();
        process.exit(argv[0] ? 1 : 0);
    }

    const track = TRACKS[trackId];
    const { saveBaseline: saveFlag, diffTargetArg } = parseArgs(argv.slice(1));
    const diffTarget =
        diffTargetArg ||
        (fs.existsSync(track.lastSyncedPath)
            ? fs.readFileSync(track.lastSyncedPath, 'utf8').trim()
            : '') ||
        'main';

    const { localRepoPath, resolvedRepo } = resolveRepo(track.configPath);
    if (!localRepoPath) {
        console.error(`Missing clone path for ${trackId}. Set LOCAL_REPO_PATH or edit:`);
        console.error(' ', path.relative(REPO_ROOT, track.configPath));
        process.exit(1);
    }

    assertGitRepo(resolvedRepo);
    track.run(track, resolvedRepo, diffTarget, saveFlag);
}

if (require.main === module) {
    main(process.argv.slice(2));
}

module.exports = { main, normalizeTrackId, TRACKS };
