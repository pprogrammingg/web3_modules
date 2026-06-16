// Course data — Levels 1–7 (20 modules): three modules per level on L1–L6; L7 has two specialization modules.
// Global courseLevel is the level number on the index.
//
// verify-paths.js derives paths from id/path pairs below (paths under hyperscale/).
const COURSE_DATA = {
    courseLevelMeta: [
        { level: 1, title: 'Orientation & foundations', careerBand: 'Basic → repo-ready reader', description: 'Hyperscale overview, state-machine vocabulary, blockchain literacy—before the tx-flow map.' },
        { level: 2, title: 'Systems & flow map', careerBand: 'Basic → pipeline thinker', description: 'Consensus, distributed-systems vocabulary, and the tx-flow map—before phase drills.' },
        { level: 3, title: 'Phases I–III', careerBand: 'In-depth → single-shard pipeline', description: 'Mempool through propose→commit and execution waves.' },
        { level: 4, title: 'Phase IV & references', careerBand: 'In-depth → cross-shard + commitments', description: 'Cross-shard tx, block-field deep dive, timers & chain time.' },
        { level: 5, title: 'Single-shard E2E', careerBand: 'In-depth → harness & labs', description: 'Harness reading plus simulation and production hands-on labs.' },
        { level: 6, title: 'Cross-shard E2E & performance', careerBand: 'In-depth → cross-shard engineer', description: 'Cross-shard labs and hyperscale-sim performance measurement.' },
        { level: 7, title: 'Networking & crypto', careerBand: 'In-depth → crypto & networking context', description: 'libp2p introduction and signature/QC roles in the node.' }
    ],
    levels: {
        basic: {
            title: 'Level 1',
            description: 'Hyperscale overview → state machines → blockchain fundamentals.',
            modules: [
                {
                    courseLevel: '1',
                    id: 'intermediate-hs-overview',
                    title: 'Hyperscale-rs Overview & Setup',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 1',
                    path: 'hyperscale/hyperscale-rs/module-01-overview.html',
                    description: 'Build, run, and trace logs—start here before the transaction-flow map.',
                    objectives: [
                        'Build and run sim/production paths locally',
                        'Trace one flow with debugger/log mindset',
                        'Know which crates the flow map will reference',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '1',
                    id: 'basic-04',
                    title: 'State Machines & Event-Driven Architecture',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 1',
                    path: 'hyperscale/basic/module-04-state-machines.html',
                    description: 'Events-in/actions-out and ShardLoop vocabulary—before you read crate-specific flow.',
                    objectives: [
                        'Explain NodeStateMachine composition pattern',
                        'Trace ProtocolEvent vs ShardLoop responsibilities',
                        'See why real clocks stay outside core state machines',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '1',
                    id: 'basic-01',
                    title: 'Blockchain Fundamentals',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 1',
                    path: 'hyperscale/basic/module-01-blockchain-fundamentals.html',
                    description: 'What a chain is, decentralization, immutability—general vocabulary before consensus and tx-flow.',
                    objectives: [
                        'Understand blockchain basics',
                        'Learn decentralization and trust models',
                        'Contrast chain types at a high level',
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false,
                }
            ]
        },
        intermediate: {
            title: 'Levels 2–6',
            description: 'Tx-flow & phases → single-shard E2E (read + labs) → cross-shard labs → performance.',
            modules: [
                {
                    courseLevel: '2',
                    id: 'basic-02',
                    title: 'Consensus: From Basics to BFT',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 2',
                    path: 'hyperscale/basic/module-02-consensus-basics.html',
                    description: 'Consensus problem, BFT intuition, quorum certificates—prep for Phase 2 propose→commit.',
                    objectives: [
                        'State the consensus problem',
                        'Contrast BFT-style quorum thinking with PoW/PoS narratives',
                        'Relate QCs to voting rounds',
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false,
                },
                {
                    courseLevel: '2',
                    id: 'basic-03',
                    title: 'Distributed Systems Fundamentals',
                    duration: '2–2.5 hours',
                    difficulty: 'Level 2',
                    path: 'hyperscale/basic/module-03-distributed-systems.html',
                    description: 'CAP, partial synchrony, safety vs liveness, quorums—language for partitions and delays before deep BFT drills.',
                    objectives: [
                        'Apply CAP to realistic failures',
                        'Explain partial synchrony and why BFT can terminate',
                        'Separate safety and liveness arguments',
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false,
                },
                {
                    courseLevel: '2',
                    id: 'basic-05b',
                    title: 'Transaction Flow: User to Finality',
                    duration: '~45 min',
                    difficulty: 'Level 2',
                    path: 'hyperscale/hyperscale-rs/module-01b-tx-flow.html',
                    description: 'Single diagram for stages/crates—canonical map; crate-group table is here.',
                    objectives: [
                        'Read the flow diagram as a checklist',
                        'Match stages to crates without duplicating later drills',
                        'Know where to debug first when a tx stalls',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '3',
                    id: 'hs-phase-01',
                    title: 'Deep dive — Phase 1: Submit → Mempool',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 3',
                    path: 'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html',
                    description: 'In-depth drill on RPC, crossbeam, gossip, validation, per-validator mempool.',
                    objectives: [
                        'Trace one single-shard tx from wallet RPC to Pending on validators',
                        'Explain why gossip runs even for same-shard submit',
                        'Evaluate censorship, per-validator mempool, and chain-time expiry',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '3',
                    id: 'hs-phase-02',
                    title: 'Deep dive — Phase 2: Propose → Commit',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 3',
                    path: 'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html',
                    description: 'In-depth drill on propose → vote → QC → commit; shard coordinator paths and in-repo proofs.',
                    objectives: [
                        'Explain proposer_for vs should_propose and why there is no ProposalTimer',
                        'Trace BuildProposal → ProposalBuilt → vote → QC → commit_block',
                        'Separate revote from equivocation and QC-via-parent_qc from “QC gossip”',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '3',
                    id: 'hs-phase-03',
                    title: 'Deep dive — Phase 3: Execution & Waves',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 3',
                    path: 'hyperscale/hyperscale-rs/module-phase-03-execution-waves.html',
                    description: 'Post-commit execution: waves, EC aggregation, finalize_wave → FinalizedWavesAdmitted; includes Hyperscale-rs vs Radix Engine boundary.',
                    objectives: [
                        'Trace ExecutionCoordinator::on_block_committed and setup_waves_and_dispatch',
                        'Separate commit time from Radix execution and FinalizedWave inclusion',
                        'Explain wave leader, WAVE_TIMEOUT, and where the external engine runs manifests',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '4',
                    id: 'hs-phase-04',
                    title: 'Deep dive — Phase 4: Cross-Shard Tx',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 4',
                    path: 'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html',
                    description: 'Multi-shard gossip, per-shard BFT, CommittedBlockHeader, ProvisionCoordinator, five-phase execution protocol (no 2PC); quizzes.',
                    objectives: [
                        'Map tx-flow steps 6 and 13–14 to gossip, provisions, and wave dispatch',
                        'Explain provision-based atomicity vs a global 2PC coordinator',
                        'Connect committed-header attestation to cross-shard provision verification',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '4',
                    id: 'hs-block-fields',
                    title: 'Deep Dive: Block Fields & Root Commitments',
                    duration: '35–50 min',
                    difficulty: 'Level 4',
                    path: 'hyperscale/hyperscale-rs/module-block-fields-deep-dive.html',
                    description: 'After Phases 1–4: commitments vs signatures, how each *_root is computed, per-block scope, WaveCertificate vs teaching “transaction certificate”.',
                    objectives: [
                        'Distinguish consensus (QC) vs execution (FinalizedWave) vs cross-shard (provisions)',
                        'Compute transaction_root and explain state_root JMT replay',
                        'Trace one tx through roots without a global history Merkle',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '4',
                    id: 'hs-timers',
                    title: 'Timers & Chain Time',
                    duration: '40–55 min',
                    difficulty: 'Level 4',
                    path: 'hyperscale/hyperscale-rs/module-timers-reference.html',
                    description: 'Master table of every timer/timeout—purpose in English, chain time vs wall clock, event-driven proposals.',
                    objectives: [
                        'Explain height vs round and ViewChange liveness',
                        'Map WAVE_TIMEOUT, provision fallback, and fetch timeouts to their clocks',
                        'Contrast proposal latch with ViewChangeTimer',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '5',
                    id: 'hs-e2e-harness',
                    title: 'E2E harnesses (simulation + production)',
                    duration: '2–2.5 hours',
                    difficulty: 'Level 5',
                    path: 'hyperscale/hyperscale-rs/module-hs-simulation-harness-analysis.html',
                    description: 'SimulationRunner/EventKey plus production pinned shard-loop, RPC ingress, and observability—reading before hands-on labs.',
                    objectives: [
                        'Separate sim time from wall clock and trace test_e2e_single_shard_transaction',
                        'Map RPC SubmitTransaction vs tx_submission_sender to consensus_rx',
                        'Contrast SimulationRunner with run_shard_loop production wiring',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '5',
                    id: 'hs-improved-sim-tests',
                    kind: 'project',
                    title: 'Single-Shard Simulation E2E Tests: Improved/Innovative New Test Case',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 5',
                    path: 'hyperscale/hyperscale-rs/module-hs-improved-simulation-tests.html',
                    description: 'Hands-on: instrument test_e2e_single_shard_transaction and explore SimulationStats vs simulated time.',
                    objectives: [
                        'Add trace markers to an existing single-shard simulation E2E test',
                        'Assert height synchronization with harness-aware tolerance',
                        'Explain why starving simulated time blocks progress',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '5',
                    id: 'hs-improved-prod-tests',
                    kind: 'project',
                    title: 'Single-Shard Production E2E Tests: Improved/Innovative New Test Case',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 5',
                    path: 'hyperscale/hyperscale-rs/module-hs-improved-production-tests.html',
                    description: 'Hands-on: instrument test_production_runner_with_network and document ingress hooks.',
                    objectives: [
                        'Add tracing markers to a production integration test',
                        'Assert network listen addresses and clean shutdown',
                        'Document how you would inject SubmitTransaction via tx_submission_sender',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '6',
                    id: 'hs-improved-cross-shard-sim-tests',
                    kind: 'project',
                    title: 'Cross-Shard Simulation E2E Tests: Improved/Innovative New Test Case',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 6',
                    path: 'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-simulation-tests.html',
                    description: 'Hands-on: instrument test_e2e_cross_shard_transaction (multi_shard_config, six validators).',
                    objectives: [
                        'Run and trace the deterministic cross-shard simulation E2E',
                        'Add markers around genesis funding and cross-shard submit',
                        'Compare mempool and finalization signals on both shard groups',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '6',
                    id: 'hs-improved-cross-shard-prod-tests',
                    kind: 'project',
                    title: 'Cross-Shard Production E2E Tests: Improved/Innovative New Test Case',
                    duration: '1–1.5 hours',
                    difficulty: 'Level 6',
                    path: 'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-production-tests.html',
                    description: 'Design lab: map simulation cross-shard E2E to production wiring gaps (no dedicated prod cross-shard E2E yet).',
                    objectives: [
                        'List observability hooks a multi-shard production E2E would need',
                        'Contrast single-shard production runner test with cross-shard requirements',
                        'Draft acceptance criteria for a future production cross-shard integration test',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                },
                {
                    courseLevel: '6',
                    id: 'intermediate-performance',
                    kind: 'project',
                    title: 'Performance Measurement',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 6',
                    path: 'hyperscale/hyperscale-rs/module-10-performance-measurement.html',
                    description: 'Hands-on: run hyperscale-sim, read SimulationReport, compare parameter sweeps.',
                    objectives: [
                        'Run hyperscale-sim and capture TPS and latency percentiles',
                        'Compare two parameter sets and explain one change',
                        'Name one sim strength and one production-only metric',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                }
            ]
        },
        advanced: {
            title: 'Level 7',
            description: 'libp2p introduction and cryptography in the node.',
            modules: [
                {
                    courseLevel: '7',
                    id: 'basic-07',
                    title: 'libp2p: Why It Matters for Protocol Engineers',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 7',
                    path: 'hyperscale/basic/module-05-libp2p.html',
                    description: 'Ecosystem context—gateway to extended Hyperscale libp2p modules.',
                    objectives: [
                        'Explain transports, identity, discovery at ecosystem level',
                        'Relate libp2p users (Eth, IPFS) to design choices',
                        'Know where to continue for gossipsub and production topics',
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false,
                },
                {
                    courseLevel: '7',
                    id: 'intermediate-08',
                    title: 'Cryptography in Hyperscale-rs',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 7',
                    path: 'hyperscale/hyperscale-rs/module-08-cryptography.html',
                    description: 'Signature roles, QC types, and validator binding—where Ed25519 and BLS appear in the node.',
                    objectives: [
                        'Locate QC, validator binding, and certified block types',
                        'Contrast Ed25519 vs BLS responsibilities',
                        'Map crypto touchpoints to consensus and execution',
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false,
                }
            ]
        }
    }
};


// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('hyperscale-course-progress');
    return saved ? JSON.parse(saved) : {};
}

// Save progress to localStorage
function saveProgress(progress) {
    localStorage.setItem('hyperscale-course-progress', JSON.stringify(progress));
}

// Get module status
function getModuleStatus(moduleId) {
    const progress = loadProgress();
    return progress[moduleId] || 'pending';
}

// Mark module as completed
function completeModule(moduleId) {
    const progress = loadProgress();
    progress[moduleId] = 'completed';
    saveProgress(progress);
}

// Mark module as in progress
function startModule(moduleId) {
    const progress = loadProgress();
    if (progress[moduleId] !== 'completed') {
        progress[moduleId] = 'in-progress';
        saveProgress(progress);
    }
}

// Calculate overall progress
function calculateOverallProgress() {
    const progress = loadProgress();
    let total = 0;
    let completed = 0;

    for (const level in COURSE_DATA.levels) {
        for (const module of COURSE_DATA.levels[level].modules) {
            total++;
            if (progress[module.id] === 'completed') {
                completed++;
            }
        }
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0;
}

// Get modules by hyperscale-specific flag
function getHyperscaleModules() {
    const modules = [];
    for (const level in COURSE_DATA.levels) {
        for (const module of COURSE_DATA.levels[level].modules) {
            if (module.hyperscaleSpecific) {
                modules.push(module);
            }
        }
    }
    return modules;
}

// Get general modules (not hyperscale-specific)
function getGeneralModules() {
    const modules = [];
    for (const level in COURSE_DATA.levels) {
        for (const module of COURSE_DATA.levels[level].modules) {
            if (!module.hyperscaleSpecific) {
                modules.push(module);
            }
        }
    }
    return modules;
}
