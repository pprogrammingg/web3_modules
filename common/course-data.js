// Course data — Levels 1–7 with exactly three modules per level.
// Global courseLevel is the level number on the index. Each level includes one
// contributionModule (purple card) mapped to real hyperscale-rs OSS issues.
//
// verify-paths.js derives paths from id/path pairs below (paths under hyperscale/).
const COURSE_DATA = {
    courseLevelMeta: [
        {
            level: 1,
            title: 'Foundations',
            careerBand: 'Junior → protocol-literate contributor',
            description:
                'Core blockchain and BFT vocabulary, then a single-shard transaction-flow map—concrete context before long reading runs.'
        },
        {
            level: 2,
            title: 'Systems & first hands-on PR',
            careerBand: 'Mid-level → distributed-systems thinker',
            description:
                'Distributed systems and event-driven design, then your first OSS PR (E2E tests)—practice before deep crate navigation.'
        },
        {
            level: 3,
            title: 'Hyperscale orientation',
            careerBand: 'Senior-minded → codebase cartographer',
            description:
                'Build & run the repo, map crates and issues, then simulator work—after you have already shipped a first PR.'
        },
        {
            level: 4,
            title: 'Sharding & consensus',
            careerBand: 'Senior → consensus & sharding specialist',
            description:
                'Sharding concepts, BFT implementation in Rust, cross-shard flow—and wiring stake weights into consensus thinking.'
        },
        {
            level: 5,
            title: 'Execution, crypto & time',
            careerBand: 'Senior / Staff- → execution & crypto engineer',
            description:
                'Execution stack, cryptographic roles in the node, timing/liveness—and batch cryptography integration work.'
        },
        {
            level: 6,
            title: 'Measurement, E2E tests & lab project',
            careerBand: 'Staff → measurement & reliability leader',
            description:
                'Performance views, tracing tests through the harness, then a guided lab—plus expanding transaction/substate tests.'
        },
        {
            level: 7,
            title: 'Networking depth',
            careerBand: 'Staff / Principal → P2P & platform',
            description:
                'libp2p motivation through production topics—and shipping infrastructure such as systemd units for validators.'
        }
    ],
    levels: {
        basic: {
            title: 'Level 1',
            description: 'Exactly three modules: concepts → concepts → single-shard transaction flow (no OSS slot—hands-on PR starts Level 2).',
            modules: [
                {
                    courseLevel: 1,
                    id: 'basic-01',
                    title: 'Blockchain Fundamentals',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 1',
                    path: 'hyperscale/basic/module-01-blockchain-fundamentals.html',
                    description: 'What a chain is, decentralization, immutability—no Hyperscale-specific code yet.',
                    objectives: [
                        'Understand blockchain basics',
                        'Learn decentralization and trust models',
                        'Contrast chain types at a high level'
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false
                },
                {
                    courseLevel: 1,
                    id: 'basic-02',
                    title: 'Consensus: From Basics to BFT',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 1',
                    path: 'hyperscale/basic/module-02-consensus-basics.html',
                    description: 'Consensus problem, BFT intuition, quorum certificates—prep for HotStuff-2 in later levels.',
                    objectives: [
                        'State the consensus problem',
                        'Contrast BFT-style quorum thinking with PoW/PoS narratives',
                        'Relate QCs to voting rounds'
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false
                },
                {
                    courseLevel: 1,
                    id: 'basic-05b',
                    title: 'Transaction Flow: User to Finality',
                    duration: '~45 min',
                    difficulty: 'Level 1',
                    path: 'hyperscale/hyperscale-rs/module-01b-tx-flow.html',
                    description:
                        'Single diagram for stages/crates—Hyperscale context before systems theory and your first PR.',
                    objectives: [
                        'Read the flow diagram as a checklist',
                        'Match stages to crates without duplicating later drills',
                        'Know where to debug first when a tx stalls'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                }
            ]
        },
        intermediate: {
            title: 'Levels 2–5',
            description: 'Four levels × three modules — theory pairs with code navigation, then execution/crypto.',
            modules: [
                {
                    courseLevel: 2,
                    id: 'basic-03',
                    title: 'Distributed Systems Fundamentals',
                    duration: '2–2.5 hours',
                    difficulty: 'Level 2',
                    path: 'hyperscale/basic/module-03-distributed-systems.html',
                    description: 'CAP, partial synchrony, safety vs liveness, quorums—language for partitions and delays.',
                    objectives: [
                        'Apply CAP to realistic failures',
                        'Explain partial synchrony and why BFT can terminate',
                        'Separate safety and liveness arguments'
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false
                },
                {
                    courseLevel: 2,
                    id: 'basic-04',
                    title: 'State Machines & Event-Driven Architecture',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 2',
                    path: 'hyperscale/basic/module-04-state-machines.html',
                    description: 'Events-in/actions-out, determinism—matches hyperscale-rs architecture without reading every crate.',
                    objectives: [
                        'Explain NodeStateMachine composition pattern',
                        'Trace ProtocolEvent vs IoLoop responsibilities',
                        'See why real clocks stay outside core state machines'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 2,
                    id: 'basic-06',
                    title: 'OSS contribution — Docs, tests & first PR',
                    duration: '3–5 hours',
                    difficulty: 'Level 2',
                    path: 'hyperscale/hyperscale-rs/module-03-first-contribution.html',
                    description:
                        'Sim vs prod E2E orientation, traced canonical tests, then one new simulation E2E plus one production E2E extension—fork, PR, CI.',
                    objectives: [
                        'Explain simulation vs production harnesses and locate E2E tests in-tree',
                        'Write numbered traces for one canonical sim E2E and one prod E2E',
                        'Ship new simulation and production E2E tests with reproducible cargo commands'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: true,
                    contributionIssue: 'General first contribution (practice before larger issues)'
                },
                {
                    courseLevel: 3,
                    id: 'intermediate-hs-overview',
                    title: 'Hyperscale-rs Overview & Setup',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 3',
                    path: 'hyperscale/hyperscale-rs/module-01-overview.html',
                    description: 'Build, run, trace logs—after first PR; pairs with codebase navigation next.',
                    objectives: [
                        'Build and run sim/production paths locally',
                        'Trace one flow with debugger/log mindset',
                        'Know where crate-groups module fits next'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 3,
                    id: 'intermediate-hs-codebase',
                    title: 'OSS contribution — Issue detailing & navigation',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 3',
                    path: 'hyperscale/hyperscale-rs/module-02-codebase-exploration.html',
                    description:
                        'Map crates and flows; OSS track teaches issue writing that maintainers love (#35)—steps and payoff spelled out.',
                    objectives: [
                        'Navigate core, node, and types crates confidently',
                        'Draft issues with repro, expected vs actual, and a proposed slice',
                        'Share drafts early and feel the impact when others pick them up'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 3,
                    id: 'intermediate-hs-crate-groups',
                    title: 'OSS contribution — Simulator trait & dedup (#23)',
                    duration: '2–3 hours',
                    difficulty: 'Level 3',
                    path: 'hyperscale/hyperscale-rs/module-01c-crate-groups.html',
                    description:
                        'Six crate-group quizzes plus a gentle OSS trail for #23—map divergence, propose a trait, draft PR with one callsite.',
                    objectives: [
                        'Pass group quizzes without merging them into tx-flow memorization',
                        'Locate simulator vs simulation crates with concrete file anchors',
                        'Ship incremental progress on #23 and celebrate small mergeable slices'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: true,
                    contributionIssue: '#23 — Parallel vs deterministic sim trait (hyperscalers/hyperscale-rs)'
                },
                {
                    courseLevel: 4,
                    id: 'intermediate-02',
                    title: 'Sharding & Cross-Shard Concepts',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 4',
                    path: 'hyperscale/intermediate/module-01-sharding.html',
                    description: 'General sharding vocabulary—before Hyperscale-specific provision mechanics.',
                    objectives: [
                        'Define shard boundaries and routing intuition',
                        'Explain cross-shard dependency risks',
                        'Contrast coordinator myths with provision-style coordination'
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false
                },
                {
                    courseLevel: 4,
                    id: 'intermediate-01',
                    title: 'OSS contribution — BFT flow & stake weights (#16)',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 4',
                    path: 'hyperscale/hyperscale-rs/module-04-bft-implementation.html',
                    description:
                        'Block lifecycle and Rust routines; OSS track for #16—observe first, name risks, then a thin first PR.',
                    objectives: [
                        'Follow block stages and coordinator/action_handlers paths',
                        'Separate this chapter from cross-shard mechanics',
                        'Practice stake-weight thinking with safety-first steps toward #16'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: true,
                    contributionIssue: '#16 — Connect stake weights with consensus'
                },
                {
                    courseLevel: 4,
                    id: 'intermediate-03',
                    title: 'Cross-Shard Transactions in Hyperscale-rs',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 4',
                    path: 'hyperscale/hyperscale-rs/module-05-cross-shard.html',
                    description: 'Provision-based coordination and receipts—distinct from BFT chapter and generic sharding intro.',
                    objectives: [
                        'Trace provisions vs execution waves',
                        'Explain receipt tiers without repeating BFT proofs',
                        'Locate cross-shard liveness edges from earlier modules'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-04',
                    title: 'Transaction Execution & Radix Engine',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 5',
                    path: 'hyperscale/hyperscale-rs/module-06-execution.html',
                    description: 'Execution coordinator and engine boundary—not a repeat of BFT or networking.',
                    objectives: [
                        'Separate consensus commitment from execution waves',
                        'Locate execution vs engine responsibilities',
                        'Anticipate crypto hooks discussed next'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-timing',
                    title: 'Timing: Rounds, Heights, Timeouts & Timers',
                    duration: '1–1.5 hours',
                    difficulty: 'Level 5',
                    path: 'hyperscale/hyperscale-rs/module-09-timing.html',
                    description: 'View-change timers vs event-driven proposals—orthogonal module to execution and crypto chapters.',
                    objectives: [
                        'Explain height vs round and view-change liveness',
                        'Map ViewChangeTimer/CleanupTimer to node code',
                        'Contrast timer-driven liveness with try_propose latching'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-08',
                    title: 'OSS contribution — Batch crypto validation (#43)',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 5',
                    path: 'hyperscale/hyperscale-rs/module-08-cryptography.html',
                    description:
                        'Signature roles and touchpoints; OSS steps for #43—fork safely, benchmark honestly, integrate with maintainer buy-in.',
                    objectives: [
                        'Locate QC, validator binding, and certified block types',
                        'Contrast Ed25519 vs BLS responsibilities',
                        'Walk the measurable contribution path for batch validation (#43)'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: true,
                    contributionIssue: '#43 — Fork radix-transactions for batch crypto validation'
                }
            ]
        },
        advanced: {
            title: 'Levels 6–7',
            description: 'Perf + tests + lab, then libp2p depth with infra contribution.',
            modules: [
                {
                    courseLevel: 6,
                    id: 'intermediate-performance',
                    title: 'Performance Measurement',
                    duration: '1–1.5 hours',
                    difficulty: 'Level 6',
                    path: 'hyperscale/hyperscale-rs/module-10-performance-measurement.html',
                    description: 'Simulation vs production metrics—orthogonal to line-by-line E2E tracing.',
                    objectives: [
                        'Interpret metrics tables from sim and prod',
                        'List gaps sim cannot see',
                        'Design one additional measurement experiment'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 6,
                    id: 'intermediate-e2e-tests',
                    title: 'OSS contribution — E2E traces & substate tests (#18)',
                    duration: '1–1.5 hours',
                    difficulty: 'Level 6',
                    path: 'hyperscale/hyperscale-rs/module-11-e2e-tests.html',
                    description:
                        'Trace sim/prod harnesses; OSS checklist for #18—pick real shapes, test deterministically, draft early.',
                    objectives: [
                        'Trace one sim E2E through IoLoop::step',
                        'Contrast pinned production loop vs deterministic runner',
                        'Add focused tests toward #18 and feel the win when CI stays green'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: true,
                    contributionIssue: '#18 — Add suite of transaction/substate tests'
                },
                {
                    courseLevel: 6,
                    id: 'intermediate-project-01',
                    title: 'Hands-on lab: E2E observability',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 6',
                    path: 'hyperscale/hyperscale-rs/project-01-e2e-observability.html',
                    description: 'Instrument tests and assert cross-validator invariants—practice deck paired with the E2E reading module.',
                    objectives: [
                        'Instrument an existing E2E test',
                        'Assert height synchronization across validators',
                        'Ship observations as a small follow-on PR after #18 planning'
                    ],
                    hyperscaleSpecific: true,
                    contributionModule: false
                },
                {
                    courseLevel: 7,
                    id: 'basic-07',
                    title: 'libp2p: Why It Matters for Protocol Engineers',
                    duration: '1.5–2 hours',
                    difficulty: 'Level 7',
                    path: 'hyperscale/basic/module-05-libp2p.html',
                    description: 'Ecosystem context—does not duplicate Hyperscale adapter internals.',
                    objectives: [
                        'Explain transports, identity, discovery at ecosystem level',
                        'Relate libp2p users (Eth, IPFS) to design choices',
                        'Set context before intermediate Hyperscale networking depth'
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false
                },
                {
                    courseLevel: 7,
                    id: 'intermediate-libp2p',
                    title: 'libp2p: Transports, Identity, Security & Discovery',
                    duration: '2–2.5 hours',
                    difficulty: 'Level 7',
                    path: 'hyperscale/intermediate/module-06-libp2p.html',
                    description: 'Mechanisms and protocols—broader than single-repo gossip wiring.',
                    objectives: [
                        'Choose transports and security stacks with reasoning',
                        'Use PeerId / multiaddr confidently',
                        'Understand DHT discovery trade-offs'
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: false
                },
                {
                    courseLevel: 7,
                    id: 'advanced-libp2p',
                    title: 'OSS contribution — Gossipsub, prod topics & systemd (#41)',
                    duration: '2–2.5 hours',
                    difficulty: 'Level 7',
                    path: 'hyperscale/advanced/module-09-libp2p.html',
                    description:
                        'GossipSub operations and production concerns; OSS steps for #41—units that operators can trust, tested honestly.',
                    objectives: [
                        'Explain mesh control messages and backoff',
                        'Relate topics to validator operations',
                        'Ship systemd templates for #41 with clear logs and scope discipline'
                    ],
                    hyperscaleSpecific: false,
                    contributionModule: true,
                    contributionIssue: '#41 — Infra: systemd (and related) service definitions'
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
