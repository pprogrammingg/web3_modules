#!/usr/bin/env node
/** Regenerate hyperscale course-data.js — 8 levels, 23 modules (L8 has 2). */
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '../common/course-data.js');
const tail = fs.readFileSync(out, 'utf8').slice(fs.readFileSync(out, 'utf8').indexOf('// Load progress'));

const meta = `    courseLevelMeta: [
        { level: 1, title: 'Orientation & foundations', careerBand: 'Junior → repo-ready reader', description: 'Hyperscale overview, state-machine vocabulary, blockchain literacy—before the tx-flow map.' },
        { level: 2, title: 'Flow map & phase I', careerBand: 'Mid-level → pipeline thinker', description: 'Consensus, transaction-flow diagram, Phase 1 submit→mempool.' },
        { level: 3, title: 'Phases II–IV', careerBand: 'Senior-minded → pipeline depth', description: 'Propose→commit through cross-shard outline (hands-on harness labs come next).' },
        { level: 4, title: 'Single-shard simulation harness', careerBand: 'Senior → deterministic tests', description: 'Simulation harness analysis + single-shard simulation E2E hands-on.' },
        { level: 5, title: 'Single-shard production harness', careerBand: 'Senior → production wiring', description: 'Production E2E harness + single-shard production hands-on; then CAP and sharding vocabulary.' },
        { level: 6, title: 'Cross-shard theory & E2E labs', careerBand: 'Senior → cross-shard engineer', description: 'Hyperscale cross-shard reading, then simulation and production cross-shard E2E hands-on labs.' },
        { level: 7, title: 'Execution, timing & measurement', careerBand: 'Staff- → execution & ops', description: 'Radix execution boundary, liveness timers, hyperscale-sim performance lab.' },
        { level: 8, title: 'Cryptography & P2P', careerBand: 'Staff- → crypto & networking context', description: 'libp2p introduction and signature/QC roles in the node.' }
    ],`;

const modules = [
    { courseLevel: 1, id: 'intermediate-hs-overview', title: 'Hyperscale-rs Overview & Setup', duration: '1.5–2 hours', difficulty: 'Level 1', path: 'hyperscale/hyperscale-rs/module-01-overview.html', description: 'Build, run, and trace logs—start here before the transaction-flow map.', objectives: ['Build and run sim/production paths locally', 'Trace one flow with debugger/log mindset', 'Know which crates the flow map will reference'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 1, id: 'basic-04', title: 'State Machines & Event-Driven Architecture', duration: '1.5–2 hours', difficulty: 'Level 1', path: 'hyperscale/basic/module-04-state-machines.html', description: 'Events-in/actions-out and IoLoop vocabulary—before you read crate-specific flow.', objectives: ['Explain NodeStateMachine composition pattern', 'Trace ProtocolEvent vs IoLoop responsibilities', 'See why real clocks stay outside core state machines'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 1, id: 'basic-01', title: 'Blockchain Fundamentals', duration: '1.5–2 hours', difficulty: 'Level 1', path: 'hyperscale/basic/module-01-blockchain-fundamentals.html', description: 'What a chain is, decentralization, immutability—general vocabulary before consensus and tx-flow.', objectives: ['Understand blockchain basics', 'Learn decentralization and trust models', 'Contrast chain types at a high level'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 2, id: 'basic-02', title: 'Consensus: From Basics to BFT', duration: '1.5–2 hours', difficulty: 'Level 2', path: 'hyperscale/basic/module-02-consensus-basics.html', description: 'Consensus problem, BFT intuition, quorum certificates—prep for Phase 2 propose→commit.', objectives: ['State the consensus problem', 'Contrast BFT-style quorum thinking with PoW/PoS narratives', 'Relate QCs to voting rounds'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 2, id: 'basic-05b', title: 'Transaction Flow: User to Finality', duration: '~45 min', difficulty: 'Level 2', path: 'hyperscale/hyperscale-rs/module-01b-tx-flow.html', description: 'Single diagram for stages/crates—canonical map; crate-group table is here.', objectives: ['Read the flow diagram as a checklist', 'Match stages to crates without duplicating later drills', 'Know where to debug first when a tx stalls'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 2, id: 'hs-phase-01', title: 'Deep dive — Phase 1: Submit → Mempool', duration: '1.5–2 hours', difficulty: 'Level 2', path: 'hyperscale/hyperscale-rs/module-phase-01-submit-to-mempool.html', description: 'Staff-level drill on RPC, crossbeam, gossip, validation, per-validator mempool.', objectives: ['Trace one single-shard tx from wallet RPC to Pending on validators', 'Explain why gossip runs even for same-shard submit', 'Evaluate censorship, per-validator mempool, and chain-time expiry'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 3, id: 'hs-phase-02', title: 'Deep dive — Phase 2: Propose → Commit', duration: '1.5–2 hours', difficulty: 'Level 3', path: 'hyperscale/hyperscale-rs/module-phase-02-propose-vote-commit.html', description: 'Staff drill on propose → vote → QC → commit; BFT coordinator paths and in-repo proofs (replaces legacy BFT module).', objectives: ['Explain proposer_for vs should_propose and why there is no ProposalTimer', 'Trace BuildProposal → ProposalBuilt → vote → QC → commit_block', 'Separate revote from equivocation and QC-via-parent_qc from “QC gossip”'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 3, id: 'hs-phase-03', title: 'Deep dive — Phase 3: Execution & Waves', duration: '~1.5 hours (outline)', difficulty: 'Level 3', path: 'hyperscale/hyperscale-rs/module-phase-03-execution-waves.html', description: 'Outline: post-commit execution, waves, vote retry and wave timeout.', objectives: ['Contrast single-shard execution with cross-shard phase'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 3, id: 'hs-phase-04', title: 'Deep dive — Phase 4: Cross-Shard Tx', duration: '~2 hours (outline)', difficulty: 'Level 3', path: 'hyperscale/hyperscale-rs/module-phase-04-cross-shard-tx.html', description: 'Outline: gossip to all shards, provisions, five-phase protocol.', objectives: ['Map to cross-shard module and tx-flow steps 6 and 13–14'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 4, id: 'hs-sim-harness', title: 'E2E simulation harness & test case analysis', duration: '1–1.5 hours', difficulty: 'Level 4', path: 'hyperscale/hyperscale-rs/module-hs-simulation-harness-analysis.html', description: 'SimulationRunner, EventKey ordering, run_until, and canonical test_e2e_single_shard_transaction trace.', objectives: ['Separate sim time from wall clock', 'Trace SubmitTransaction through the event queue', 'Read SimulationStats as a harness health signal'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 4, id: 'hs-improved-sim-tests', kind: 'project', title: 'Single-Shard Simulation E2E Tests: Improved/Innovative New Test Case', duration: '1.5–2 hours', difficulty: 'Level 4', path: 'hyperscale/hyperscale-rs/module-hs-improved-simulation-tests.html', description: 'Hands-on: instrument test_e2e_single_shard_transaction and explore SimulationStats vs simulated time.', objectives: ['Add trace markers to an existing single-shard simulation E2E test', 'Assert height synchronization with harness-aware tolerance', 'Explain why starving simulated time blocks progress'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 4, id: 'hs-prod-e2e-harness', title: 'E2E production test case — harness, user input & observability', duration: '1–1.5 hours', difficulty: 'Level 4', path: 'hyperscale/hyperscale-rs/module-hs-production-e2e-harness.html', description: 'Production harness, RPC / tx_submission_sender ingress, what production E2Es can show.', objectives: ['Map RPC SubmitTransaction vs tx_submission_sender to consensus_rx', 'Trace test_production_runner_with_network and run_pinned_loop', 'List what production E2E tests can observe without a full tx path'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 5, id: 'hs-improved-prod-tests', kind: 'project', title: 'Single-Shard Production E2E Tests: Improved/Innovative New Test Case', duration: '1.5–2 hours', difficulty: 'Level 5', path: 'hyperscale/hyperscale-rs/module-hs-improved-production-tests.html', description: 'Hands-on: instrument test_production_runner_with_network and document ingress hooks.', objectives: ['Add tracing markers to a production integration test', 'Assert network listen addresses and clean shutdown', 'Document how you would inject SubmitTransaction via tx_submission_sender'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 5, id: 'basic-03', title: 'Distributed Systems Fundamentals', duration: '2–2.5 hours', difficulty: 'Level 5', path: 'hyperscale/basic/module-03-distributed-systems.html', description: 'CAP, partial synchrony, safety vs liveness, quorums—language for partitions and delays.', objectives: ['Apply CAP to realistic failures', 'Explain partial synchrony and why BFT can terminate', 'Separate safety and liveness arguments'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 5, id: 'intermediate-02', title: 'Sharding & Cross-Shard Concepts', duration: '1.5–2 hours', difficulty: 'Level 5', path: 'hyperscale/intermediate/module-01-sharding.html', description: 'General sharding vocabulary—before Hyperscale-specific provision mechanics.', objectives: ['Define shard boundaries and routing intuition', 'Explain cross-shard dependency risks', 'Contrast coordinator myths with provision-style coordination'], hyperscaleSpecific: false, contributionModule: false },
    { courseLevel: 6, id: 'intermediate-03', title: 'Cross-Shard Transactions in Hyperscale-rs', duration: '1.5–2 hours', difficulty: 'Level 6', path: 'hyperscale/hyperscale-rs/module-05-cross-shard.html', description: 'Provision-based coordination and receipts—distinct from Phase 2 single-shard BFT drill.', objectives: ['Trace provisions vs execution waves', 'Explain receipt tiers without repeating BFT proofs', 'Locate cross-shard liveness edges from earlier modules'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 6, id: 'hs-improved-cross-shard-sim-tests', kind: 'project', title: 'Cross-Shard Simulation E2E Tests: Improved/Innovative New Test Case', duration: '1.5–2 hours', difficulty: 'Level 6', path: 'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-simulation-tests.html', description: 'Hands-on: instrument test_e2e_cross_shard_transaction (multi_shard_config, six validators).', objectives: ['Run and trace the deterministic cross-shard simulation E2E', 'Add markers around genesis funding and cross-shard submit', 'Compare mempool and finalization signals on both shard groups'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 6, id: 'hs-improved-cross-shard-prod-tests', kind: 'project', title: 'Cross-Shard Production E2E Tests: Improved/Innovative New Test Case', duration: '1–1.5 hours', difficulty: 'Level 6', path: 'hyperscale/hyperscale-rs/module-hs-improved-cross-shard-production-tests.html', description: 'Design lab: map simulation cross-shard E2E to production wiring gaps (no dedicated prod cross-shard E2E yet).', objectives: ['List observability hooks a multi-shard production E2E would need', 'Contrast single-shard production runner test with cross-shard requirements', 'Draft acceptance criteria for a future production cross-shard integration test'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 7, id: 'intermediate-04', title: 'Transaction Execution & Radix Engine', duration: '1.5–2 hours', difficulty: 'Level 7', path: 'hyperscale/hyperscale-rs/module-06-execution.html', description: 'Execution coordinator and engine boundary—not a repeat of BFT or networking.', objectives: ['Separate consensus commitment from execution waves', 'Locate execution vs engine responsibilities', 'Anticipate cryptographic touchpoints next'], hyperscaleSpecific: true, contributionModule: false },
    { courseLevel: 7, id: 'intermediate-timing', title: 'Timing: Rounds, Heights, Timeouts & Timers', duration: '1–1.5 hours', difficulty: 'Level 7', path: 'hyperscale/hyperscale-rs/module-09-timing.html', description: 'View-change timers vs event-driven proposals—orthogonal to execution and crypto chapters.', objectives: ['Explain height vs round and view-change liveness', 'Map ViewChangeTimer/CleanupTimer to node code', 'Contrast timer-driven liveness with try_propose latching'], hyperscaleSpecific: true, contributionModule: false },
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

const head = `// Course data — Levels 1–8: three modules per level on L1–L7; L8 has 2 (23 modules).
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
