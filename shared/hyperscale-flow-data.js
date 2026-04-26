/**
 * Hyperscale-rs flow & crate mapping — single source of truth for teaching modules.
 * Workflow when repo updates: see shared/HYPERSCALE_FLOW_README.md.
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
        livelock: 'crates/livelock',
    };

    /**
     * Key file paths and line hints for maintainers. When you run git diff and see
     * one of these files changed, check the flow steps that reference it.
     * Format: path under repo -> optional { lineHint, note }.
     */
    const FILE_REFS = {
        'crates/bft/src/state.rs': { lineHint: 'BftState, on_* methods, latest_qc, commit_block_and_buffered', note: 'BFT flow, module-04' },
        'crates/bft/src/handlers.rs': { lineHint: 'build_proposal, verify_and_build_qc', note: 'BFT flow' },
        'crates/bft/src/vote_set.rs': { lineHint: 'build_qc', note: 'QC formation' },
        'crates/bft/src/pending.rs': { lineHint: 'PendingBlock', note: 'BFT flow' },
        'crates/node/src/io_loop/mod.rs': { lineHint: 'IoLoop::step, SubmitTransaction, TransactionValidated, validation pipeline', note: 'Tx ingress, overview, E2E' },
        'crates/node/src/state.rs': { lineHint: 'NodeStateMachine, self.bft, TransactionGossipReceived, on_block_committed', note: 'Tx flow, BFT, overview' },
        'crates/node/src/protocol/mod.rs': { lineHint: 'fetch/sync submodules (protocol logic in subdirs)', note: 'Overview flow 1' },
        'crates/node/src/io_loop/handlers.rs': { lineHint: 'register_gossip_handler TransactionGossip, notification handlers', note: 'Tx ingress, overview' },
        'crates/node/src/action_handler.rs': { lineHint: 'Action::BuildProposal', note: 'BFT build' },
        'crates/core/src/action.rs': { lineHint: 'Action::PersistAndBroadcastVote, VerifyAndBuildQuorumCertificate, CommitBlock', note: 'Tx flow step 10, 11' },
        'crates/core/src/event.rs': { lineHint: 'Event types', note: 'Tx flow' },
        'crates/core/src/traits.rs': { lineHint: 'StateMachine trait', note: 'Overview links' },
        'crates/types/src/block.rs': { lineHint: 'BlockHeader.parent_qc', note: 'Tx flow step 10' },
        'crates/types/src/transaction.rs': { lineHint: 'analyze_instructions_v1/v2, declared_reads/writes', note: 'Cross-shard module-05' },
        'crates/types/src/topology.rs': { lineHint: 'consensus_shards, provisioning_shards, shard_for_node', note: 'Cross-shard module-05' },
        'crates/types/src/quorum_certificate.rs': { lineHint: 'QuorumCertificate', note: 'BFT' },
        'crates/types/src/state.rs': { lineHint: 'StateCertificate', note: 'BFT' },
        'crates/types/src/receipt.rs': { lineHint: 'GlobalReceipt, LocalReceipt, ExecutionMetadata (three-tier receipt model)', note: 'Receipt overhaul, module-05' },
        'crates/mempool/src/state.rs': { lineHint: 'mempool state, on_submit_transaction, on_transaction_gossip', note: 'Overview flow 1' },
        'crates/execution/src/state.rs': { lineHint: 'start_cross_shard_execution, required_shards', note: 'Cross-shard module-05' },
        'crates/simulator/src/runner.rs': { lineHint: 'workload submit, schedule_initial_event', note: 'Overview flow 1' },
        'crates/simulation/src/runner.rs': { lineHint: 'SubmitTransaction, BFT message handler', note: 'Overview flows 1, 2' },
        'crates/production/src/runner.rs': { lineHint: 'Libp2pAdapter::new, ed25519_keypair, validator bind signature', note: 'Module-08 crypto' },
        'crates/network-libp2p/src/adapter/identity.rs': { lineHint: 'generate_random_keypair (libp2p Ed25519)', note: 'Module-08 crypto' },
        'crates/network-libp2p/src/validator_bind.rs': { lineHint: 'validator-bind protocol, BLS signature over PeerId', note: 'Module-08 crypto' },
        'crates/messages/src/notification/mod.rs': { lineHint: 'block_header, block_vote, execution_*', note: 'Messages: gossip → notification (module-04, tx flow)' },
        'crates/network-libp2p/src/adapter/core.rs': { lineHint: 'network adapter', note: 'Network' },
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
        { step: 6, title: '(Cross-shard) Tx travels to each involved shard', lane: 'hyperscale', crates: [{ name: 'provisions', oneLiner: 'centralized provision coordination; drives cross-shard flow' }, { name: 'production', oneLiner: 'cross-shard messaging (libp2p Gossipsub on shard-scoped topics)' }, { name: 'node', oneLiner: 'composes provisions, coordination state' }], outsideNote: 'Livelock crate handles cross-shard dependency-cycle detection.' },
        { step: 7, title: 'Proposer selection (per shard, per round)', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'view, leader election' }, { name: 'core', oneLiner: 'traits, time' }, { name: 'types', oneLiner: 'block, validator set' }] },
        { step: 8, title: 'Block proposal', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'proposal logic' }, { name: 'types', oneLiner: 'Block, BlockHeader' }, { name: 'node', oneLiner: 'routes ProposalTimer, etc.' }] },
        { step: 9, title: 'Validators vote', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'block validation logic and voting; collects votes' }, { name: 'types', oneLiner: 'Block, Vote, signatures' }] },
        { step: 10, title: 'Quorum certificate (QC) formed', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'vote collection, QC build request, latest_qc, block build with parent_qc' }, { name: 'types', oneLiner: 'BlockHeader.parent_qc (block.rs), QuorumCertificate' }, { name: 'core', oneLiner: 'Action::PersistAndBroadcastVote, Action::VerifyAndBuildQuorumCertificate' }], fileRefs: ['crates/bft/src/state.rs', 'crates/bft/src/vote_set.rs', 'crates/types/src/block.rs', 'crates/core/src/action.rs'] },
        { step: 11, title: 'Block committed', lane: 'hyperscale', crates: [{ name: 'node', oneLiner: 'CommitBlock action, composition' }, { name: 'bft', oneLiner: 'commit rule' }, { name: 'core', oneLiner: 'Action::CommitBlock' }] },
        { step: 12, title: 'Execution', lane: 'hyperscale', crates: [{ name: 'execution', oneLiner: 'execution state machine; provision-based cross-shard (no 2PC coordinator)' }, { name: 'engine', oneLiner: 'Radix Engine integration for smart contract execution' }, { name: 'node', oneLiner: 'composes execution' }], outsideNote: 'Execution semantics (Radix Engine) are in engine crate / vendor.' },
        { step: 13, title: '(Cross-shard) Coordination & composition', lane: 'hyperscale', crates: [{ name: 'provisions', oneLiner: 'ProvisionCoordinator: provision tracking and ProvisioningComplete' }, { name: 'execution', oneLiner: 'cross-shard execution after provisions (five-phase protocol)' }, { name: 'node', oneLiner: 'composes provisions, execution, core' }, { name: 'core', oneLiner: 'Event/Action for coordination' }], outsideNote: 'See module Cross-Shard Transactions for provision-based protocol and livelock.' },
        { step: 14, title: 'Finality & persistence', lane: 'hyperscale', crates: [{ name: 'bft', oneLiner: 'finality rule' }, { name: 'node', oneLiner: 'state, persistence' }] },
    ];

    /**
     * BFT Rust internal flow (genesis → commit). Used by module-04-bft-implementation.html Summary.
     */
    const BFT_RUST_INTERNAL_STEPS = [
        { step: 1, title: 'Initialized genesis block', crates: ['bft'], routine: 'BftState::initialize_genesis' },
        { step: 2, title: 'Requesting block build', crates: ['bft'], routine: 'BftState::on_proposal_timer (emits Action::BuildProposal)' },
        { step: 3, title: 'Block built', crates: ['bft', 'node'], routine: 'hyperscale_bft::handlers::build_proposal (then event ProposalBuilt)' },
        { step: 4, title: 'Broadcasting proposal', crates: ['bft'], routine: 'BftState::on_proposal_built (emits BroadcastBlockHeader + own vote)' },
        { step: 5, title: 'QC formed', crates: ['bft'], routine: 'BftState::on_qc_formed (QC built by handlers::verify_and_build_qc)' },
        { step: 6, title: 'Committing block', crates: ['bft'], routine: 'BftState::commit_block_and_buffered (from on_block_ready_to_commit)' },
    ];

    /**
     * Which teaching modules use which flow data. When you change a flow or crate path,
     * update the corresponding HTML files listed here.
     *
     * Flow ID → [ module path (relative to repo root) ]
     */
    const MODULE_USAGE = {
        'tx-flow': [
            'hyperscale-rs/module-01b-tx-flow.html',
        ],
        'bft-single-shard': [
            'hyperscale-rs/module-04-bft-implementation.html',
        ],
        'bft-multi-shard': [
            'hyperscale-rs/module-04-bft-implementation.html',
        ],
        'bft-rust-internal': [
            'hyperscale-rs/module-04-bft-implementation.html',
        ],
        '2pc-flow': [
            'hyperscale-rs/module-05-cross-shard.html',
        ],
        /* 2pc-flow: legacy name; hyperscale-rs uses provision-flow only (no 2PC coordinator) */
        'provision-flow': [
            'hyperscale-rs/module-05-cross-shard.html',
        ],
        'overview-flow-1': [
            'hyperscale-rs/module-01-overview.html',
        ],
        'overview-flow-2': [
            'hyperscale-rs/module-01-overview.html',
        ],
        'overview-flow-3': [
            'hyperscale-rs/module-01-overview.html',
        ],
        'crate-groups': [
            'hyperscale-rs/module-01b-tx-flow.html',
            'hyperscale-rs/module-01c-crate-groups.html',
        ],
        'file-refs-general': [
            'hyperscale-rs/module-04-bft-implementation.html',
            'hyperscale-rs/module-05-cross-shard.html',
            'hyperscale-rs/module-01-overview.html',
            'hyperscale-rs/module-08-cryptography.html',
        ],
        'timing': [
            'hyperscale-rs/module-09-timing.html',
        ],
    };

    /**
     * All paths referenced by flow data (crates + file refs). Used by check-hyperscale-changes.js
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
