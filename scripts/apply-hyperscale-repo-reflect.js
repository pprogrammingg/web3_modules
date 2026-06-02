#!/usr/bin/env node
/**
 * Bulk-update teaching HTML after hyperscale-rs bft→shard/beacon refactor.
 * Run once after reflect-changes.js lists affected modules.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dirs = [
    path.join(ROOT, 'hyperscale'),
    path.join(ROOT, 'common'),
];

const REPLACEMENTS = [
    ['BftCoordinator', 'ShardCoordinator'],
    ['hyperscale_bft::', 'hyperscale_shard::'],
    ['crates/bft/', 'crates/shard/'],
    ['data-crate="bft"', 'data-crate="shard"'],
    ['self.bft.', 'self.shard_coordinator.'],
    ['self.bft ', 'self.shard_coordinator '],
    ['crates/node/src/state/bft.rs', 'crates/node/src/state/shard.rs'],
    ['state/bft.rs', 'state/shard.rs'],
    ['handle_bft', 'handle_shard'],
    ['BftConfig', 'ShardConsensusConfig'],
    ['crates/bft/src/config.rs', 'crates/shard/src/config.rs'],
    ['crates/types/src/block/header.rs', 'crates/types/src/shard/header.rs'],
    ['crates/types/src/quorum_certificate.rs', 'crates/types/src/shard/quorum_certificate.rs'],
    ['crates/types/src/block/certified.rs', 'crates/types/src/shard/certified.rs'],
    ['crates/node/src/io_loop/network_handlers.rs', 'crates/node/src/process_io/network_handlers.rs'],
    ['crates/node/src/io_loop/actions.rs', 'crates/node/src/shard_loop/actions.rs'],
    ['crates/node/src/io_loop/step/protocol_event.rs', 'crates/node/src/shard_loop/step/protocol_event.rs'],
    ['crates/node/src/io_loop/mod.rs', 'crates/node/src/shard_loop/mod.rs'],
    ['crates/node/src/io_loop/init.rs', 'crates/node/src/process_io/mod.rs'],
    ['crates/node/src/io_loop/protocol/mod.rs', 'crates/node/src/shard_io/mod.rs'],
    ['IoLoop::step', 'ShardLoop::run_step'],
    ['run_pinned_loop', 'run_shard_loop'],
    ['pinned io-loop', 'per-shard shard-loop'],
    ['io-loop thread', 'shard-loop thread'],
    ['the io-loop', 'the shard-loop'],
    ['crates/messages/src/notification/mod.rs', 'crates/types/src/network/notification (gossip payloads)'],
    ['crates/node/src/io_loop/step/tx_validation.rs', 'crates/node/src/shard_loop/step/tx_validation.rs'],
    ['IoLoop', 'ShardLoop'],
    ['io_loop', 'shard_loop'],
    ['io-loop', 'shard-loop'],
    ['ProdIoLoop', 'ProdShardLoop'],
    ['spawn_pinned_loop', 'spawn_shard_loop'],
    ['pinned IoLoop', 'per-shard ShardLoop'],
    ['handle_bft_action', 'handle_shard_action'],
];

function walk(dir, out) {
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) walk(p, out);
        else if (/\.(html|js|md)$/.test(name) && !name.includes('course-data')) out.push(p);
    }
}

const files = [];
dirs.forEach((d) => walk(d, files));

let touched = 0;
for (const file of files) {
    let s = fs.readFileSync(file, 'utf8');
    const orig = s;
    for (const [a, b] of REPLACEMENTS) s = s.split(a).join(b);
    if (s !== orig) {
        fs.writeFileSync(file, s);
        touched++;
    }
}
console.log('Updated', touched, 'files');
