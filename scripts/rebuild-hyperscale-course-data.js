#!/usr/bin/env node
/** Regenerate hyperscale course-data.js — 8 levels, 19 modules (L8 has 2). */
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '../common/course-data.js');
const tail = fs.readFileSync(out, 'utf8').slice(fs.readFileSync(out, 'utf8').indexOf('// Load progress'));

const meta = `    courseLevelMeta: [
        { level: 1, title: 'Orientation & foundations', careerBand: 'Basic → repo-ready reader', description: 'Hyperscale overview, state-machine vocabulary, blockchain literacy—before the tx-flow map.' },
        { level: 2, title: 'Systems, flow map & phase I', careerBand: 'Basic → pipeline thinker', description: 'Consensus, distributed-systems vocabulary (CAP, safety/liveness), tx-flow map, Phase 1.' },
        { level: 3, title: 'Phases II–IV & timing', careerBand: 'In-depth → pipeline depth', description: 'Propose→commit, liveness timers, execution waves (incl. Radix boundary), cross-shard outline.' },
        { level: 4, title: 'Single-shard E2E harness', careerBand: 'In-depth → deterministic tests', description: 'Combined simulation + production harness reading, then single-shard simulation E2E hands-on.' },
        { level: 5, title: 'Single-shard production E2E', careerBand: 'In-depth → production wiring', description: 'Single-shard production hands-on lab after harness reading.' },
        { level: 6, title: 'Cross-shard E2E labs', careerBand: 'In-depth → cross-shard engineer', description: 'Cross-shard simulation and production E2E hands-on labs (theory is Phase 4).' },
        { level: 7, title: 'Performance measurement', careerBand: 'In-depth → execution & ops', description: 'hyperscale-sim performance lab—after you know harnesses and cross-shard paths.' },
        { level: 8, title: 'Cryptography & P2P', careerBand: 'In-depth → crypto & networking context', description: 'libp2p introduction and signature/QC roles in the node.' }
    ],`;

const modules = [
    { courseLevel: 1, id: 'intermediate-hs-overview', title: 'Hyperscale-rs Overview & Setup', duration: '1.5–2 hours', difficulty: 'Level 1', path: 'hyperscale/hyperscale-rs/module-01-overview.html', description: 'Build, run, and trace logs—start here before the transaction-flow map.', objectives: ['Build and run sim/production paths locally', 'Trace one flow with debugger/log mindset', 'Know which crates the flow map will reference'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 1, id: 'basic-04', title: 'State Machines & Event-Driven Architecture', duration: '1.5–2 hours', difficulty: 'Level 1', path: 'hyperscale/basic/module-04-state-machines.html', description: 'Events-in/actions-out and ShardLoop vocabulary—before you read crate-specific flow.', objectives: ['Explain NodeStateMachine composition pattern', 'Trace ProtocolEvent vs ShardLoop responsibilities', 'See why real clocks stay outside core state machines'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 1, id: 'basic-01', title: 'Blockchain Fundamentals', duration: '1.5–2 hours', difficulty: 'Level 1', path: 'hyperscale/basic/module-01-blockchain-fundamentals.html', description: 'What a chain is, decentralization, immutability—general vocabulary before consensus and tx-flow.', objectives: ['Understand blockchain basics', 'Learn decentralization and trust models', 'Contrast chain types at a high level'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 2, id: 'basic-02', title: 'Consensus: From Basics to BFT', duration: '1.5–2 hours', difficulty: 'Level 2', path: 'hyperscale/basic/module-02-consensus-basics.html', description: 'Consensus problem, BFT intuition, quorum certificates—prep for Phase 2 propose→commit.', objectives: ['State the consensus problem', 'Contrast BFT-style quorum thinking with PoW/PoS narratives', 'Relate QCs to voting rounds'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 2, id: 'basic-03', title: 'Distributed Systems Fundamentals', duration: '2–2.5 hours', difficulty: 'Level 2', path: 'hyperscale/basic/module-03-distributed-systems.html', description: 'CAP, partial synchrony, safety vs liveness, quorums—language for partitions and delays before deep BFT drills.', objectives: ['Apply CAP to realistic failures', 'Explain partial synchrony and why BFT can terminate', 'Separate safety and liveness arguments'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 2, id: 'basic-05b', title: 'Transaction Flow: User to Finality', duration: '~45 min', difficulty: 'Level 2', path: 'hyperscale/hyperscale-rs/module-01b-tx-flow.html', description: 'Single diagram for stages/crates—canonical map; crate-group table is here.', objectives: ['Read the flow diagram as a checklist', 'Match stages to crates without duplicating later drills', 'Know where to debug first when a tx stalls'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 2, id: 'hs-phase-01', title: 'Deep dive — Phase 1: Submit → Mempool', duration: '1.5–2 hours', difficulty: 'Level 2', path: 'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html', description: 'In-depth drill on RPC, crossbeam, gossip, validation, per-validator mempool.', objectives: ['Trace one single-shard tx from wallet RPC to Pending on validators', 'Explain why gossip runs even for same-shard submit', 'Evaluate censorship, per-validator mempool, and chain-time expiry'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 3, id: 'hs-phase-02', title: 'Deep dive — Phase 2: Propose → Commit', duration: '1.5–2 hours', difficulty: 'Level 3', path: 'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html', description: 'In-depth drill on propose → vote → QC → commit; BFT coordinator paths and in-repo proofs (replaces legacy BFT module).', objectives: ['Explain proposer_for vs should_propose and why there is no ProposalTimer', 'Trace BuildProposal → ProposalBuilt → vote → QC → commit_block', 'Separate revote from equivocation and QC-via-parent_qc from “QC gossip”'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 3, id: 'intermediate-timing', title: 'Timing: Rounds, Heights, Timeouts & Timers', duration: '1–1.5 hours', difficulty: 'Level 3', path: 'hyperscale/hyperscale-rs/module-09-timing.html', description: 'View-change timers vs event-driven proposals—right after Phase 2 commit/liveness story.', objectives: ['Explain height vs round and view-change liveness', 'Map ViewChangeTimer/CleanupTimer to node code', 'Contrast timer-driven liveness with try_propose latching'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 3, id: 'hs-phase-03', title: 'Deep dive — Phase 3: Execution & Waves', duration: '1.5–2 hours', difficulty: 'Level 3', path: 'hyperscale/hyperscale-rs/module-phase-03-execution-waves.html', description: 'Post-commit execution: waves, EC aggregation, finalize_wave → FinalizedWavesAdmitted; includes Hyperscale-rs vs Radix Engine boundary (replaces standalone execution module).', objectives: ['Trace ExecutionCoordinator::on_block_committed and setup_waves_and_dispatch', 'Separate commit time from Radix execution and FinalizedWave inclusion', 'Explain wave leader, WAVE_TIMEOUT, and where the external engine runs manifests'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 3, id: 'hs-phase-04', title: 'Deep dive — Phase 4: Cross-Shard Tx', duration: '1.5–2 hours', difficulty: 'Level 3', path: 'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html', description: 'Multi-shard gossip, per-shard BFT, CommittedBlockHeader, ProvisionCoordinator, five-phase execution protocol (no 2PC); quizzes.', objectives: ['Map tx-flow steps 6 and 13–14 to gossip, provisions, and wave dispatch', 'Explain provision-based atomicity vs a global 2PC coordinator', 'Connect committed-header attestation to cross-shard provision verification'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 4, id: 'hs-e2e-harness', title: 'E2E harnesses (simulation + production)', duration: '2–2.5 hours', difficulty: 'Level 4', path: 'hyperscale/hyperscale-rs/module-hs-simulation-harness-analysis.html', description: 'SimulationRunner/EventKey plus production pinned shard-loop, RPC ingress, and observability—one reading module before hands-on labs.', objectives: ['Separate sim time from wall clock and trace test_e2e_single_shard_transaction', 'Map RPC SubmitTransaction vs tx_submission_sender to consensus_rx', 'Contrast SimulationRunner with run_shard_loop production wiring'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 4, id: 'hs-improved-sim-tests', kind: 'project', title: 'Single-Shard Simulation E2E Tests: Improved/Innovative New Test Case', duration: '1.5–2 hours', difficulty: 'Level 4', path: 'hyperscale/hyperscale-rs/module-hs-improved-simulation-tests.html', description: 'Hands-on: instrument test_e2e_single_shard_transaction and explore SimulationStats vs simulated time.', objectives: ['Add trace markers to an existing single-shard simulation E2E test', 'Assert height synchronization with harness-aware tolerance', 'Explain why starving simulated time blocks progress'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 5, id: 'hs-improved-prod-tests', kind: 'project', title: 'Single-Shard Production E2E Tests: Improved/Innovative New Test Case', duration: '1.5–2 hours', difficulty: 'Level 5', path: 'hyperscale/hyperscale-rs/module-hs-improved-production-tests.html', description: 'Hands-on: instrument test_production_runner_with_network and document ingress hooks.', objectives: ['Add tracing markers to a production integration test', 'Assert network listen addresses and clean shutdown', 'Document how you would inject SubmitTransaction via tx_submission_sender'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 6, id: 'hs-improved-cross-shard-sim-tests', kind: 'project', title: 'Cross-Shard Simulation E2E Tests: Improved/Innovative New Test Case', duration: '1.5–2 hours', difficulty: 'Level 6', path: 'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-simulation-tests.html', description: 'Hands-on: instrument test_e2e_cross_shard_transaction (multi_shard_config, six validators).', objectives: ['Run and trace the deterministic cross-shard simulation E2E', 'Add markers around genesis funding and cross-shard submit', 'Compare mempool and finalization signals on both shard groups'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 6, id: 'hs-improved-cross-shard-prod-tests', kind: 'project', title: 'Cross-Shard Production E2E Tests: Improved/Innovative New Test Case', duration: '1–1.5 hours', difficulty: 'Level 6', path: 'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-production-tests.html', description: 'Design lab: map simulation cross-shard E2E to production wiring gaps (no dedicated prod cross-shard E2E yet).', objectives: ['List observability hooks a multi-shard production E2E would need', 'Contrast single-shard production runner test with cross-shard requirements', 'Draft acceptance criteria for a future production cross-shard integration test'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 7, id: 'intermediate-performance', kind: 'project', title: 'Performance Measurement', duration: '1.5–2 hours', difficulty: 'Level 7', path: 'hyperscale/hyperscale-rs/module-10-performance-measurement.html', description: 'Hands-on: run hyperscale-sim, read SimulationReport, compare parameter sweeps.', objectives: ['Run hyperscale-sim and capture TPS and latency percentiles', 'Compare two parameter sets and explain one change', 'Name one sim strength and one production-only metric'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 8, id: 'basic-07', title: 'libp2p: Why It Matters for Protocol Engineers', duration: '1.5–2 hours', difficulty: 'Level 8', path: 'hyperscale/basic/module-05-libp2p.html', description: 'Ecosystem context—gateway to extended Hyperscale libp2p modules.', objectives: ['Explain transports, identity, discovery at ecosystem level', 'Relate libp2p users (Eth, IPFS) to design choices', 'Know where to continue for gossipsub and production topics'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 8, id: 'intermediate-08', title: 'Cryptography in Hyperscale-rs', duration: '1.5–2 hours', difficulty: 'Level 8', path: 'hyperscale/hyperscale-rs/module-08-cryptography.html', description: 'Signature roles, QC types, and validator binding—where Ed25519 and BLS appear in the node.', objectives: ['Locate QC, validator binding, and certified block types', 'Contrast Ed25519 vs BLS responsibilities', 'Map crypto touchpoints to consensus and execution'], hyperscaleSpecific: true, contributionModule: false },
];

function fmt(m) {
    const lines = ['                {'];
    for (const [k, v] of Object.entries(m)) {
        if (Array.isArray(v)) {
            lines.push(`                    ${k}: [`);
            v.forEach((s) => lines.push(`                        '${s.replace(/'/g, "\\'")}',`));
            lines.push('                    ],');
        } else if (typeof v === 'boolean') lines.push(`                    ${k}: ${v},`);
        else if (k === 'kind') lines.push(`                    kind: '${v}',`);
        else lines.push(`                    ${k}: '${String(v).replace(/'/g, "\\'")}',`);
    }
    lines.push('                }');
    return lines.join('\n');
}

const basic = modules.filter((m) => m.courseLevel === 1);
const inter = modules.filter((m) => m.courseLevel >= 2 && m.courseLevel <= 7);
const adv = modules.filter((m) => m.courseLevel === 8);

const head = `// Course data — Levels 1–8 (19 modules): generic foundations early; merged E2E harness read.
// Global courseLevel is the level number on the index.
//
// verify-paths.js derives paths from id/path pairs below (paths under hyperscale/).
const COURSE_DATA = {
${meta}
    levels: {
        basic: {
            title: 'Level 1',
            description: 'Hyperscale overview → state machines → blockchain fundamentals.',
            modules: [
${basic.map(fmt).join(',\n')}
            ]
        },
        intermediate: {
            title: 'Levels 2–7',
            description: 'Tx-flow & phases → single-shard harness labs → cross-shard E2E labs → execution & measurement.',
            modules: [
${inter.map(fmt).join(',\n')}
            ]
        },
        advanced: {
            title: 'Level 8',
            description: 'libp2p introduction and cryptography in the node.',
            modules: [
${adv.map(fmt).join(',\n')}
            ]
        }
    }
};

`;

fs.writeFileSync(out, head + '\n' + tail);
console.log('wrote', modules.length, 'modules');
