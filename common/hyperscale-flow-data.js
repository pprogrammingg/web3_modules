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
        bft: 'crates/bft',
        execution: 'crates/execution',
        engine: 'crates/engine',
        provisions: 'crates/provisions',
        messages: 'crates/messages',
        simulator: 'crates/simulator',
        simulation: 'crates/simulation',
    };

    /**
     * Key file paths and line hints for maintainers. When you run git diff and see
     * one of these files changed, check the flow steps that reference it.
     * Format: path under repo -> optional { lineHint, note }.
     */
    const FILE_REFS = {
        'crates/bft/src/coordinator.rs': { lineHint: 'BftCoordinator, try_propose, on_* paths, commit_block_and_buffered', note: 'BFT flow, module-04' },
        'crates/bft/src/action_handlers.rs': { lineHint: 'build_proposal, verify_and_build_qc', note: 'BFT flow' },
        'crates/bft/src/vote_set.rs': { lineHint: 'build_qc', note: 'QC formation' },
        'crates/bft/src/pending.rs': { lineHint: 'PendingBlock', note: 'BFT flow' },
        'crates/bft/src/vote_keeper.rs': { lineHint: 'voted_heights, received_votes_by_height', note: 'BFT votes' },
        'crates/node/src/io_loop/mod.rs': { lineHint: 'IoLoop::step, SubmitTransaction, TransactionValidated, validation pipeline', note: 'Tx ingress, overview, E2E' },
        'crates/node/src/io_loop/step/protocol_event.rs': { lineHint: 'feed_event continuations after persist', note: 'Messaging inventory' },
        'crates/node/src/state/mod.rs': { lineHint: 'NodeStateMachine::handle, composition, try_event_driven_proposal', note: 'Tx flow, BFT, overview' },
        'crates/node/src/state/transactions.rs': { lineHint: 'ProtocolEvent::TransactionValidated → mempool', note: 'Tx flow' },
        'crates/node/src/state/proposal.rs': { lineHint: 'gather_proposal_inputs, try_event_driven_proposal', note: 'BFT proposal retry' },
        'crates/node/src/state/bft.rs': { lineHint: 'handle_bft, on_qc_formed orchestration', note: 'Node BFT dispatch' },
        'crates/node/src/state/timers.rs': { lineHint: 'ViewChangeTimer, CleanupTimer, check_round_timeout', note: 'Timing module-09' },
        'crates/node/src/io_loop/protocol/mod.rs': { lineHint: 'fetch/sync/block serve protocol wiring', note: 'Overview flow 1' },
        'crates/node/src/io_loop/network_handlers.rs': { lineHint: 'register_* handlers: gossip, notification, request → NodeInput / responses', note: 'Tx ingress, messaging inventory' },
        'crates/node/src/io_loop/init.rs': { lineHint: 'register_inbound_handlers, handle_actions, install_engine_genesis', note: 'Handler registration timing (genesis + resume)' },
        'crates/node/src/io_loop/actions.rs': { lineHint: 'Action::BuildProposal and runner dispatch', note: 'BFT build' },
        'crates/core/src/action.rs': { lineHint: 'Action::PersistAndBroadcastVote, VerifyAndBuildQuorumCertificate, CommitBlock', note: 'Tx flow step 10, 11' },
        'crates/core/src/protocol_event.rs': { lineHint: 'ProtocolEvent types', note: 'Tx flow' },
        'crates/core/src/traits.rs': { lineHint: 'StateMachine trait', note: 'Overview links' },
        'crates/types/src/block/header.rs': { lineHint: 'BlockHeader.parent_qc', note: 'Tx flow step 10' },
        'crates/types/src/transaction/manifest_analysis.rs': { lineHint: 'analyze_instructions_v1/v2', note: 'Cross-shard module-05' },
        'crates/types/src/transaction/routable.rs': { lineHint: 'declared_reads, declared_writes', note: 'Cross-shard module-05' },
        'crates/types/src/topology/snapshot.rs': { lineHint: 'TopologySnapshot, involves_local_shard, shard routing', note: 'Cross-shard module-05' },
        'crates/types/src/quorum_certificate.rs': { lineHint: 'QuorumCertificate', note: 'BFT' },
        'crates/types/src/block/certified.rs': { lineHint: 'CertifiedBlock (block + certifying QC)', note: 'BFT / crypto module-08' },
        'crates/types/src/receipt/mod.rs': { lineHint: 'GlobalReceipt, ConsensusReceipt, ExecutionMetadata tiers', note: 'Receipt model, module-05' },
        'crates/mempool/src/coordinator.rs': { lineHint: 'MempoolCoordinator on_submit_transaction, on_transaction_gossip', note: 'Overview flow 1' },
        'crates/execution/src/coordinator.rs': { lineHint: 'ExecutionCoordinator, waves, cross-shard execution lifecycle', note: 'Cross-shard module-05' },
        'crates/execution/src/conflict.rs': { lineHint: 'ConflictDetector — bidirectional cycle detection; lower tx hash loses', note: 'Cross-shard module-05, replaces old livelock crate' },
        'crates/simulator/src/livelock.rs': { lineHint: 'LivelockAnalyzer, analyze_livelocks — post-run stuck-tx report', note: 'Simulator diagnostics; module-01b, perf' },
        'crates/simulator/src/runner.rs': { lineHint: 'workload submit, schedule_initial_event', note: 'Overview flow 1' },
        'crates/simulation/src/runner.rs': { lineHint: 'SubmitTransaction, BFT message handler', note: 'Overview flows 1, 2' },
        'crates/production/src/runner.rs': { lineHint: 'Libp2pAdapter::new, ed25519_keypair, validator bind signature', note: 'Module-08 crypto' },
        'crates/network-libp2p/src/adapter/identity.rs': { lineHint: 'generate_random_keypair (libp2p Ed25519)', note: 'Module-08 crypto' },
        'crates/network-libp2p/src/validator_bind.rs': { lineHint: 'validator-bind protocol, BLS signature over PeerId', note: 'Module-08 crypto' },
        'crates/messages/src/notification/mod.rs': { lineHint: 'block_header, block_vote, execution_*', note: 'Messages: gossip → notification (module-04, tx flow)' },
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
        { step: 7, title: 'Proposer selection (per shard, per round)', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'view, leader election' }, { name: 'core', oneLiner: 'traits, time' }, { name: 'types', oneLiner: 'block, validator set' }] },
        { step: 8, title: 'Block proposal', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'proposal logic' }, { name: 'types', oneLiner: 'Block, BlockHeader' }, { name: 'node', oneLiner: 'routes ProposalTimer, etc.' }] },
        { step: 9, title: 'Validators vote', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'block validation logic and voting; collects votes' }, { name: 'types', oneLiner: 'Block, Vote, signatures' }] },
        { step: 10, title: 'Quorum certificate (QC) formed', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'vote collection, QC build request, latest_qc, block build with parent_qc' }, { name: 'types', oneLiner: 'BlockHeader.parent_qc (block/header.rs), QuorumCertificate' }, { name: 'core', oneLiner: 'Action::PersistAndBroadcastVote, Action::VerifyAndBuildQuorumCertificate' }], fileRefs: ['crates/bft/src/coordinator.rs', 'crates/bft/src/vote_set.rs', 'crates/types/src/block/header.rs', 'crates/core/src/action.rs'] },
        { step: 11, title: 'Block committed', lane: 'hyperscale', crates: [{ name: 'node', oneLiner: 'CommitBlock action, composition' }, { name: 'bft', oneLiner: 'commit rule' }, { name: 'core', oneLiner: 'Action::CommitBlock' }] },
        { step: 12, title: 'Execution', lane: 'hyperscale', crates: [{ name: 'execution', oneLiner: 'execution state machine; provision-based cross-shard (no 2PC coordinator)' }, { name: 'engine', oneLiner: 'Radix Engine integration for smart contract execution' }, { name: 'node', oneLiner: 'composes execution' }], outsideNote: 'Execution semantics (Radix Engine) are in engine crate / vendor.' },
        { step: 13, title: '(Cross-shard) Coordination & composition', lane: 'hyperscale', crates: [{ name: 'provisions', oneLiner: 'ProvisionCoordinator: provision tracking and ProvisioningComplete' }, { name: 'execution', oneLiner: 'cross-shard execution after provisions (five-phase protocol)' }, { name: 'node', oneLiner: 'composes provisions, execution, core' }, { name: 'core', oneLiner: 'Event/Action for coordination' }], outsideNote: 'See Cross-Shard module for provision-based protocol and ConflictDetector / wave abort paths.' },
        { step: 14, title: 'Finality & persistence', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'finality rule' }, { name: 'node', oneLiner: 'state, persistence' }] },
    ];

    /**
     * BFT Rust internal flow (genesis → commit). Used by module-04-bft-implementation.html Summary.
     */
    const BFT_RUST_INTERNAL_STEPS = [
        { step: 1, title: 'Initialized genesis block', crates: ['bft'], routine: 'BftCoordinator::initialize_genesis' },
        { step: 2, title: 'Requesting block build', crates: ['bft', 'node'], routine: 'BftCoordinator::try_propose (new-content latch / post-dispatch retry; emits Action::BuildProposal when proposer)' },
        { step: 3, title: 'Block built', crates: ['bft', 'node'], routine: 'hyperscale_bft::action_handlers::build_proposal (then ProtocolEvent::ProposalBuilt)' },
        { step: 4, title: 'Broadcasting proposal', crates: ['bft'], routine: 'BftCoordinator::on_proposal_built (broadcast header + own vote)' },
        { step: 5, title: 'QC formed', crates: ['bft'], routine: 'BftCoordinator::on_qc_formed (QC via action_handlers::verify_and_build_qc)' },
        { step: 6, title: 'Committing block', crates: ['bft'], routine: 'BftCoordinator::commit_block_and_buffered (from on_block_ready_to_commit)' },
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
            'hyperscale/hyperscale-rs/module-05-cross-shard.html',
        ],
        'bft-rust-internal': [
            'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
        ],
        '2pc-flow': [
            'hyperscale/hyperscale-rs/module-05-cross-shard.html',
        ],
        /* 2pc-flow: legacy name; hyperscale-rs uses provision-flow only (no 2PC coordinator) */
        'provision-flow': [
            'hyperscale/hyperscale-rs/module-05-cross-shard.html',
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
            'hyperscale/hyperscale-rs/module-05-cross-shard.html',
            'hyperscale/hyperscale-rs/module-01-overview.html',
            'hyperscale/hyperscale-rs/module-08-cryptography.html',
            'hyperscale/hyperscale-rs/module-10-performance-measurement.html',
            'hyperscale/hyperscale-rs/module-hs-production-e2e-harness.html',
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
