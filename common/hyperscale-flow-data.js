/**
 * Hyperscale-rs flow & crate mapping — single source of truth for teaching modules.
 * Workflow when repo updates: see common/HYPERSCALE_FLOW_README.md.
 * Check script uses path in scripts/hyperscale-repo.config.js (or LOCAL_REPO_PATH).
 */
(function (global) {
    'use strict';

    const REPO_BASE_URL = 'https://github.com/flightofthefox/hyperscale-rs';
    const REPO_TREE = REPO_BASE_URL + '/tree/main';
    const REPO_BLOB = REPO_BASE_URL + '/blob/main';

    /** Crate name → path under repo (no leading slash). Update when crates are renamed/moved. */
    const CRATES = {
        production: 'crates/production',
        node: 'crates/node',
        mempool: 'crates/mempool',
        core: 'crates/core',
        types: 'crates/types',
        shard: 'crates/shard',
        beacon: 'crates/beacon',
        execution: 'crates/execution',
        engine: 'crates/engine',
        provisions: 'crates/provisions',
        simulator: 'crates/simulator',
        simulation: 'crates/simulation',
    };

    /**
     * Key file paths and line hints for maintainers. When you run git diff and see
     * one of these files changed, check the flow steps that reference it.
     * Format: path under repo -> optional { lineHint, note }.
     */
    const FILE_REFS = {
        'crates/shard/src/coordinator.rs': { lineHint: 'ShardCoordinator, try_propose, try_two_chain_commit, commit_block_and_buffered', note: 'Shard HotStuff-2 (was crates/bft)' },
        'crates/shard/src/action_handlers.rs': { lineHint: 'build_proposal, verify_and_build_qc', note: 'Shard consensus algorithms' },
        'crates/shard/src/vote_set.rs': { lineHint: 'build_qc', note: 'QC formation' },
        'crates/shard/src/pending.rs': { lineHint: 'PendingBlock', note: 'Shard flow' },
        'crates/shard/src/vote_keeper.rs': { lineHint: 'voted_heights; rejects runaway round gaps', note: 'Shard votes' },
        'crates/shard/src/validation.rs': { lineHint: 'validate_header, runaway round gap checks', note: 'Shard header validation' },
        'crates/beacon/src/coordinator.rs': { lineHint: 'BeaconCoordinator — PC/SPC/MSC, validator set & topology', note: 'Beacon chain (parallel to shard consensus)' },
        'crates/node/src/shard_loop/mod.rs': { lineHint: 'ShardLoop::run_step, ShardEvent queue', note: 'Tx ingress, overview, E2E (was shard_loop)' },
        'crates/node/src/shard_loop/step/protocol_event.rs': { lineHint: 'feed_event continuations after persist', note: 'Messaging inventory' },
        'crates/node/src/shard_loop/step/tx_validation.rs': { lineHint: 'SubmitTransaction → TransactionValidated', note: 'Tx ingress' },
        'crates/node/src/state/mod.rs': { lineHint: 'NodeStateMachine::handle, shard + beacon coordinators', note: 'Tx flow, overview' },
        'crates/node/src/state/transactions.rs': { lineHint: 'ProtocolEvent::TransactionValidated → mempool', note: 'Tx flow' },
        'crates/node/src/state/proposal.rs': { lineHint: 'gather_proposal_inputs, try_event_driven_proposal', note: 'Shard proposal retry' },
        'crates/node/src/state/shard.rs': { lineHint: 'handle_shard, on_qc_formed, on_block_committed order', note: 'Node shard dispatch' },
        'crates/node/src/state/beacon.rs': { lineHint: 'handle_beacon, BeaconCoordinator dispatch', note: 'Beacon chain events' },
        'crates/node/src/state/timers.rs': { lineHint: 'ViewChangeTimer, CleanupTimer, shard_coordinator.check_round_timeout', note: 'Timing module-09' },
        'crates/node/src/shard_io/mod.rs': { lineHint: 'fetch/sync/block serve protocol wiring', note: 'Overview flow 1' },
        'crates/node/src/process_io/network_handlers.rs': { lineHint: 'register_* handlers → ShardScopedInput', note: 'Tx ingress, messaging inventory' },
        'crates/node/src/process_io/mod.rs': { lineHint: 'ProcessIo, submit fan-out across shards', note: 'Production ingress' },
        'crates/node/src/shard_loop/actions.rs': { lineHint: 'Action::BuildProposal and runner dispatch', note: 'Shard build' },
        'crates/core/src/action.rs': { lineHint: 'Action::PersistAndBroadcastVote, VerifyAndBuildQuorumCertificate, CommitBlock', note: 'Tx flow step 10, 11' },
        'crates/core/src/protocol_event.rs': { lineHint: 'ProtocolEvent types (shard + beacon)', note: 'Tx flow' },
        'crates/core/src/traits.rs': { lineHint: 'StateMachine trait', note: 'Overview links' },
        'crates/types/src/shard/header.rs': { lineHint: 'BlockHeader.parent_qc', note: 'Tx flow step 10' },
        'crates/types/src/transaction/manifest_analysis.rs': { lineHint: 'analyze_instructions_v1/v2', note: 'Cross-shard Phase 4' },
        'crates/types/src/transaction/routable.rs': { lineHint: 'declared_reads, declared_writes', note: 'Cross-shard Phase 4' },
        'crates/types/src/topology/snapshot.rs': { lineHint: 'TopologySnapshot, involves_local_shard, shard routing', note: 'Cross-shard Phase 4' },
        'crates/types/src/shard/quorum_certificate.rs': { lineHint: 'QuorumCertificate', note: 'Shard QC' },
        'crates/types/src/shard/certified.rs': { lineHint: 'CertifiedBlock (block + certifying QC)', note: 'Shard / crypto module-08' },
        'crates/types/src/wave/mod.rs': { lineHint: 'FinalizedWave, GlobalReceiptRoot', note: 'Receipt / wave model, Phase 3–4' },
        'crates/mempool/src/coordinator.rs': { lineHint: 'MempoolCoordinator on_submit_transaction, on_transaction_gossip', note: 'Overview flow 1' },
        'crates/execution/src/coordinator.rs': { lineHint: 'ExecutionCoordinator, waves, cross-shard execution lifecycle', note: 'Cross-shard Phase 4' },
        'crates/execution/src/conflict.rs': { lineHint: 'ConflictDetector — bidirectional cycle detection; lower tx hash loses', note: 'Cross-shard Phase 3/4 livelock prevention' },
        'crates/simulator/src/livelock.rs': { lineHint: 'LivelockAnalyzer, analyze_livelocks — post-run stuck-tx report', note: 'Simulator diagnostics; module-01b, perf' },
        'crates/simulator/src/runner.rs': { lineHint: 'workload submit, schedule_initial_event', note: 'Overview flow 1' },
        'crates/simulation/src/runner.rs': { lineHint: 'SimulationRunner, NodeHost, ShardEvent scheduling', note: 'Overview flows 1, 2' },
        'crates/production/src/runner.rs': { lineHint: 'spawn_shard_loop, run_shard_loop, per-shard threads', note: 'Module-08 crypto + E2E harness' },
        'crates/network-libp2p/src/adapter/identity.rs': { lineHint: 'generate_random_keypair (libp2p Ed25519)', note: 'Module-08 crypto' },
        'crates/network-libp2p/src/validator_bind.rs': { lineHint: 'validator-bind protocol, BLS signature over PeerId', note: 'Module-08 crypto' },
        'crates/network/src/traits.rs': { lineHint: 'Network trait: register_* handlers, GossipHandler, NotificationHandler, request on_response', note: 'Messaging inventory' },
    };

    /**
     * Build full tree URL for a crate.
     */
    function crateUrl(crateName) {
        const path = CRATES[crateName];
        return path ? REPO_TREE + '/' + path : REPO_TREE;
    }

    /**
     * Build blob URL for a file path under repo.
     */
    function fileUrl(relativePath) {
        return REPO_BLOB + '/' + relativePath;
    }

    /**
     * Transaction flow (user to finality). Steps 1–14; used by module-01b-tx-flow.html.
     * Each step: { step, title, desc, lane: 'hyperscale'|'outside', crates: [ { name, oneLiner } ], outsideNote?, fileRefs? }.
     */
    const TX_FLOW_STEPS = [
        { step: 1, title: 'User signs transaction', lane: 'outside', crates: [], outsideNote: 'Not in Hyperscale — wallet / client application.' },
        { step: 2, title: 'Transaction submitted to network', lane: 'outside', crates: [], outsideNote: 'Network client / RPC — outside. production receives on the node side.' },
        { step: 3, title: 'Node receives transaction', lane: 'hyperscale', crates: [{ name: 'production', oneLiner: 'I/O, turns network into events' }, { name: 'node', oneLiner: 'NodeStateMachine receives events' }] },
        { step: 4, title: 'Cross-shard determination', lane: 'hyperscale', crates: [{ name: 'node', oneLiner: 'routing, shard mapping' }, { name: 'core', oneLiner: 'Event/Action types' }], outsideNote: 'Shard assignment of NodeIDs is defined by the protocol / Radix Engine.' },
        { step: 5, title: 'Mempool (per shard)', lane: 'hyperscale', crates: [{ name: 'mempool', oneLiner: 'transaction pool' }, { name: 'node', oneLiner: 'composes mempool' }, { name: 'core', oneLiner: 'Event/Action types' }] },
        { step: 6, title: '(Cross-shard) Tx travels to each involved shard', lane: 'hyperscale', crates: [{ name: 'provisions', oneLiner: 'centralized provision coordination; drives cross-shard flow' }, { name: 'production', oneLiner: 'cross-shard messaging (libp2p Gossipsub on shard-scoped topics)' }, { name: 'node', oneLiner: 'composes provisions, coordination state' }], outsideNote: 'Cycle breaks: execution ConflictDetector (crates/execution/src/conflict.rs). Post-run stuck-tx analysis: simulator/src/livelock.rs (--analyze-livelocks).' },
        { step: 7, title: 'Proposer selection (per shard, per round)', lane: 'hyperscale', crates: [{ name: 'shard', oneLiner: 'view, leader election (HotStuff-2)' }, { name: 'beacon', oneLiner: 'validator set / topology source' }, { name: 'core', oneLiner: 'traits, time' }, { name: 'types', oneLiner: 'block, validator set' }] },
        { step: 8, title: 'Block proposal', lane: 'hyperscale', crates: [{ name: 'shard', oneLiner: 'proposal logic (event-driven try_propose)' }, { name: 'types', oneLiner: 'Block, BlockHeader' }, { name: 'node', oneLiner: 'ShardLoop + state machine routing' }] },
        { step: 9, title: 'Validators vote', lane: 'hyperscale', crates: [{ name: 'shard', oneLiner: 'block validation and voting; collects votes' }, { name: 'types', oneLiner: 'Block, Vote, signatures' }] },
        { step: 10, title: 'Quorum certificate (QC) formed', lane: 'hyperscale', crates: [{ name: 'shard', oneLiner: 'vote collection, QC build request, latest_qc, block build with parent_qc' }, { name: 'types', oneLiner: 'BlockHeader.parent_qc (shard/header.rs), QuorumCertificate' }, { name: 'core', oneLiner: 'Action::PersistAndBroadcastVote, Action::VerifyAndBuildQuorumCertificate' }], fileRefs: ['crates/shard/src/coordinator.rs', 'crates/shard/src/vote_set.rs', 'crates/types/src/shard/header.rs', 'crates/core/src/action.rs'] },
        { step: 11, title: 'Block committed', lane: 'hyperscale', crates: [{ name: 'node', oneLiner: 'CommitBlock action, composition' }, { name: 'shard', oneLiner: 'two-chain commit rule' }, { name: 'core', oneLiner: 'Action::CommitBlock' }] },
        { step: 12, title: 'Execution', lane: 'hyperscale', crates: [{ name: 'execution', oneLiner: 'execution state machine; provision-based cross-shard (no 2PC coordinator)' }, { name: 'engine', oneLiner: 'Radix Engine integration for smart contract execution' }, { name: 'node', oneLiner: 'composes execution' }], outsideNote: 'Execution semantics (Radix Engine) are in engine crate / vendor.' },
        { step: 13, title: '(Cross-shard) Coordination & composition', lane: 'hyperscale', crates: [{ name: 'provisions', oneLiner: 'ProvisionCoordinator: provision tracking and ProvisioningComplete' }, { name: 'execution', oneLiner: 'cross-shard execution after provisions (five-phase protocol)' }, { name: 'node', oneLiner: 'composes provisions, execution, core' }, { name: 'core', oneLiner: 'Event/Action for coordination' }], outsideNote: 'See Cross-Shard module for provision-based protocol and ConflictDetector / wave abort paths.' },
        { step: 14, title: 'Finality & persistence', lane: 'hyperscale', crates: [{ name: 'shard', oneLiner: 'finality rule' }, { name: 'node', oneLiner: 'state, persistence' }] },
    ];

    /**
     * BFT Rust internal flow (genesis → commit). Used by module-04-bft-implementation.html Summary.
     */
    const BFT_RUST_INTERNAL_STEPS = [
        { step: 1, title: 'Initialized genesis block', crates: ['shard'], routine: 'ShardCoordinator::initialize_genesis' },
        { step: 2, title: 'Requesting block build', crates: ['shard', 'node'], routine: 'ShardCoordinator::try_propose (new-content latch / post-dispatch retry; emits Action::BuildProposal when proposer)' },
        { step: 3, title: 'Block built', crates: ['shard', 'node'], routine: 'hyperscale_shard::action_handlers::build_proposal (then ProtocolEvent::ProposalBuilt)' },
        { step: 4, title: 'Broadcasting proposal', crates: ['shard'], routine: 'ShardCoordinator::on_proposal_built (broadcast header + own vote)' },
        { step: 5, title: 'QC formed', crates: ['shard'], routine: 'ShardCoordinator::on_qc_formed (QC via action_handlers::verify_and_build_qc)' },
        { step: 6, title: 'Committing block', crates: ['shard'], routine: 'ShardCoordinator::commit_block_and_buffered (from on_block_ready_to_commit)' },
    ];

    /**
     * Which teaching modules use which flow data. When you change a flow or crate path,
     * update the corresponding HTML files listed here.
     *
     * Flow ID → [ module path (relative to repo root) ]
     */
    const MODULE_USAGE = {
        'tx-flow': [
            'hyperscale/hyperscale-rs/module-01b-tx-flow.html',
            'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html',
        ],
        'phase-submit-mempool': [
            'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html',
        ],
        'phase-propose-commit': [
            'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
        ],
        'bft-single-shard': [
            'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
        ],
        'bft-multi-shard': [
            'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html',
            'hyperscale/hyperscale-rs/module-phase-03-execution-waves.html',
        ],
        'bft-rust-internal': [
            'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
        ],
        '2pc-flow': [
            'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html',
        ],
        /* 2pc-flow: legacy name; hyperscale-rs uses provision-flow only (no 2PC coordinator) */
        'provision-flow': [
            'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html',
        ],
        'overview-flow-1': [
            'hyperscale/hyperscale-rs/module-01-overview.html',
        ],
        'overview-flow-2': [
            'hyperscale/hyperscale-rs/module-01-overview.html',
        ],
        'overview-flow-3': [
            'hyperscale/hyperscale-rs/module-01-overview.html',
        ],
        'crate-groups': [
            'hyperscale/hyperscale-rs/module-01b-tx-flow.html',
        ],
        'file-refs-general': [
            'hyperscale/hyperscale-rs/module-01b-tx-flow.html',
            'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html',
            'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
            'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
            'hyperscale/hyperscale-rs/module-phase-03-execution-waves.html',
            'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html',
            'hyperscale/hyperscale-rs/module-01-overview.html',
            'hyperscale/hyperscale-rs/module-08-cryptography.html',
            'hyperscale/hyperscale-rs/module-10-performance-measurement.html',
            'hyperscale/hyperscale-rs/module-hs-simulation-harness-analysis.html',
            'hyperscale/hyperscale-rs/module-hs-simulation-harness-analysis.html',
            'hyperscale/hyperscale-rs/module-hs-improved-simulation-tests.html',
            'hyperscale/hyperscale-rs/module-hs-improved-production-tests.html',
            'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-simulation-tests.html',
            'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-production-tests.html',
        ],
        'rust-optimization-module': [
            'hyperscale/hyperscale-rs/module-12-rust-optimizations.html',
        ],
    };

    /**
     * All paths referenced by flow data (crates + file refs). Used by scripts/reflect-changes.js hyperscale
     * to match git diff output.
     */
    function getAllReferencedPaths() {
        const paths = new Set(Object.keys(CRATES).map(c => CRATES[c]));
        Object.keys(FILE_REFS).forEach(p => paths.add(p));
        TX_FLOW_STEPS.forEach(s => { (s.fileRefs || []).forEach(p => paths.add(p)); });
        return Array.from(paths);
    }

    const HYPERSCALE_FLOW_DATA = {
        REPO_BASE_URL,
        REPO_TREE,
        REPO_BLOB,
        CRATES,
        FILE_REFS,
        crateUrl,
        fileUrl,
        TX_FLOW_STEPS,
        BFT_RUST_INTERNAL_STEPS,
        MODULE_USAGE,
        getAllReferencedPaths,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = HYPERSCALE_FLOW_DATA;
    } else {
        global.HYPERSCALE_FLOW_DATA = HYPERSCALE_FLOW_DATA;
    }
})(typeof self !== 'undefined' ? self : this);
