// Course data structure - organized by difficulty level.
// Single source of truth for module ids and paths; verify-paths.js derives its list from this file.
//
// Global `courseLevel` (1..N) is the display order on the index: former "basic" = level 1,
// intermediate bands = 2–6, advanced bands = 7–11. See `courseLevelMeta` for titles.
const COURSE_DATA = {
    courseLevelMeta: [
        {
            level: 1,
            title: 'Foundations',
            description:
                'Blockchain, consensus, distributed systems, state machines, Hyperscale-rs orientation, transaction flow, first contribution, and libp2p context.'
        },
        {
            level: 2,
            title: 'Core protocol & shards',
            description: 'Code map, BFT lifecycle, sharding concepts, and Hyperscale cross-shard flow.'
        },
        {
            level: 3,
            title: 'Execution & networking',
            description: 'Radix execution path, P2P and gossip in general, then Hyperscale network adapters.'
        },
        {
            level: 4,
            title: 'Cryptography, timing & performance',
            description: 'Signatures and aggregation, rounds and timers, and measuring sim vs production.'
        },
        {
            level: 5,
            title: 'Testing, libp2p & simulation',
            description: 'E2E test traces, hands-on project, libp2p depth, and deterministic simulation.'
        },
        {
            level: 6,
            title: 'Storage & contribution tracks',
            description: 'Persistence patterns, Hyperscale storage, and guided intermediate contributions.'
        },
        {
            level: 7,
            title: 'View changes & libp2p depth',
            description: 'Advanced consensus liveness, view changes in the codebase, and production-grade libp2p topics.'
        },
        {
            level: 8,
            title: 'Performance & security',
            description: 'Profiling, optimization, threat model, and mitigations in the node.'
        },
        {
            level: 9,
            title: 'Scale & global consensus',
            description: 'Throughput and latency patterns, then epochs and cross-shard global coordination.'
        },
        {
            level: 10,
            title: 'Shard lifecycle & production',
            description: 'Dynamic shards, production deployment, and operating Hyperscale-rs.'
        },
        {
            level: 11,
            title: 'Advanced testing & contributions',
            description: 'Property-based and fuzzing-style strategy, then major contribution projects.'
        }
    ],
    levels: {
        basic: {
            title: 'Level 1 — Foundations',
            description: 'Foundation concepts in blockchain, consensus, and distributed systems (displayed as Level 1 on the index).',
            modules: [
                {
                    courseLevel: 1,
                    id: 'basic-01',
                    title: 'Blockchain Fundamentals',
                    duration: '1.5-2 hours',
                    difficulty: 'Basic',
                    path: 'basic/module-01-blockchain-fundamentals.html',
                    description: 'Understand what blockchain is, how it works, and why it matters',
                    objectives: [
                        'Understand blockchain basics',
                        'Learn about decentralization',
                        'Understand immutability and trust',
                        'Learn about different blockchain types'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 1,
                    id: 'basic-02',
                    title: 'Consensus Algorithms: From Basics to BFT',
                    duration: '1.5-2 hours',
                    difficulty: 'Basic',
                    path: 'basic/module-02-consensus-basics.html',
                    description: 'Learn consensus algorithms, Byzantine Fault Tolerance, and why it matters',
                    objectives: [
                        'Understand consensus problem',
                        'Learn about BFT vs PoS',
                        'Understand quorum certificates',
                        'Learn HotStuff-2 basics'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 1,
                    id: 'basic-03',
                    title: 'Distributed Systems Fundamentals',
                    duration: '2-2.5 hours',
                    difficulty: 'Basic',
                    path: 'basic/module-03-distributed-systems.html',
                    description: 'CAP, partial synchrony, safety vs liveness, quorum intersection—concepts essential for BFT and Hyperscale-rs',
                    objectives: [
                        'Understand CAP theorem and partitions (CP vs AP)',
                        'Understand partial synchrony and GST (why BFT works despite FLP)',
                        'Distinguish safety vs liveness and how they trade off',
                        'Understand quorum intersection (why 3f+1 and 2f+1)',
                        'Learn leader-based consensus, view/round, and timeouts',
                        'Relate fault tolerance to protocol design'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 1,
                    id: 'basic-04',
                    title: 'State Machines & Event-Driven Architecture',
                    duration: '1.5-2 hours',
                    difficulty: 'Basic',
                    path: 'basic/module-04-state-machines.html',
                    description: 'Master the core architectural pattern used in hyperscale-rs',
                    objectives: [
                        'Understand state machine pattern',
                        'Learn event-driven design',
                        'Explore Event and Action types',
                        'Understand determinism'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 1,
                    id: 'intermediate-hs-overview',
                    title: 'Hyperscale-rs Overview & Setup',
                    duration: '1.5-2 hours',
                    difficulty: 'Basic',
                    path: 'hyperscale-rs/module-01-overview.html',
                    description: 'What hyperscale-rs is, key links, and how to trace flows end-to-end (event→action, debugger, logs)',
                    objectives: [
                        'Know what hyperscale-rs is and where to find the repo and docs',
                        'Understand the event→action loop and how to trace one flow',
                        'Know the next step: Crate Groups module and its quizzes'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 1,
                    id: 'basic-05b',
                    title: 'Transaction Flow: User to Finality',
                    duration: '~45 min',
                    difficulty: 'Basic',
                    path: 'hyperscale-rs/module-01b-tx-flow.html',
                    description: 'End-to-end diagram, crate map, and practical next steps: run the code and debug a transaction',
                    objectives: [
                        'See the full path of a transaction from user to finality',
                        'Distinguish Hyperscale vs outside (wallet, engine, network)',
                        'Map flow steps to crates (hover popups)',
                        'Follow practical next steps: Event/Action, debug one tx, where to look when things go wrong'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 1,
                    id: 'basic-06',
                    title: 'Your First Contribution: Documentation & Tests',
                    duration: '1.5-2 hours',
                    difficulty: 'Basic',
                    path: 'hyperscale-rs/module-03-first-contribution.html',
                    description: 'Make your first real contribution to hyperscale-rs',
                    objectives: [
                        'Improve documentation',
                        'Add unit tests',
                        'Fix small bugs',
                        'Submit a PR'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 1,
                    id: 'basic-07',
                    title: 'libp2p: Why It Matters for Protocol Engineers',
                    duration: '1.5–2 hours',
                    difficulty: 'Basic',
                    path: 'basic/module-05-libp2p.html',
                    description: 'What libp2p is, who uses it (Ethereum, IPFS, Filecoin, etc.), and why it matters for P2P and blockchain',
                    objectives: [
                        'Understand what libp2p is and why it matters for protocol engineering',
                        'See who uses libp2p in production',
                        'Grasp high-level components: transports, identity, security, discovery',
                        'Relate P2P networking to blockchain and distributed systems'
                    ],
                    hyperscaleSpecific: false
                }
            ]
        },
        intermediate: {
            title: 'Levels 2–6 — Protocol & implementation',
            description: 'Dive deeper into implementation details and contributions (index Levels 2–6).',
            modules: [
                {
                    courseLevel: 2,
                    id: 'intermediate-hs-crate-groups',
                    title: 'Crate Groups: First Contact to Cross-Shard',
                    duration: '2–3 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-01c-crate-groups.html',
                    description: 'Six crate groups by transaction-flow progression, with 10-question quiz per group and a Quick Test from tx submission to cross-shard flow',
                    objectives: [
                        'Read groups 1–6 in order (first contact, sharding, proposing, voting, execution, cross-shard)',
                        'Pass the 10-question quiz for each group (70% threshold)',
                        'Pass the Quick Test on crates from tx submission to cross-shard flow',
                        'Tie code reading to the transaction flow'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 2,
                    id: 'intermediate-01',
                    title: 'BFT Implementation: Block Flow and Rust',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-04-bft-implementation.html',
                    description: 'BFT and node state in Rust; block lifecycle and vote order. End-to-end flow is in Transaction Flow (module-01b).',
                    objectives: [
                        'Understand block lifecycle (proposed → certified → committed) and vote order (BlockVote before StateVoteBlock)',
                        'Follow single-shard and multi-shard block flow (provisions, no 2PC coordinator)',
                        'Map flow to BftState, NodeStateMachine, voting rules, and Rust routines'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 2,
                    id: 'intermediate-02',
                    title: 'Sharding & Cross-Shard Transactions',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'intermediate/module-01-sharding.html',
                    description: 'Understand sharding concepts and cross-shard transaction protocols',
                    objectives: [
                        'Understand sharding concepts',
                        'Understand provision coordination (proofs across shards)',
                        'Learn livelock prevention'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 2,
                    id: 'intermediate-03',
                    title: 'Cross-Shard Transactions in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-05-cross-shard.html',
                    description: 'Understand how hyperscale-rs handles cross-shard transactions',
                    objectives: [
                        'Understand provision-based cross-shard coordination in hyperscale-rs (no 2PC coordinator)',
                        'Learn ProvisionCoordinator and five-phase execution',
                        'Understand livelock prevention',
                        'Trace cross-shard flow'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 3,
                    id: 'intermediate-04',
                    title: 'Transaction Execution & Radix Engine',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-06-execution.html',
                    description: 'Learn how transactions are executed using Radix Engine',
                    objectives: [
                        'Understand transaction lifecycle',
                        'Learn about Radix Engine',
                        'Understand state management',
                        'Learn validation process'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 3,
                    id: 'intermediate-05',
                    title: 'Networking in Blockchain: libp2p & Gossip',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'intermediate/module-02-networking.html',
                    description: 'Understand P2P networking, gossip protocols, and message routing',
                    objectives: [
                        'Understand P2P networking',
                        'Learn gossip protocols',
                        'Understand message serialization',
                        'Learn about network topology'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 3,
                    id: 'intermediate-06',
                    title: 'Networking in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-07-networking.html',
                    description: 'Understand how hyperscale-rs implements networking',
                    objectives: [
                        'Understand libp2p integration',
                        'Learn message routing',
                        'Understand network adapter',
                        'Learn about gossip implementation'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 4,
                    id: 'intermediate-07',
                    title: 'Cryptography in Blockchain: Signatures & Aggregation',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'intermediate/module-03-cryptography.html',
                    description: 'Deep dive into cryptographic primitives used in blockchain',
                    objectives: [
                        'Understand BLS signatures',
                        'Learn signature aggregation',
                        'Understand vote verification',
                        'Learn about key management'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 4,
                    id: 'intermediate-08',
                    title: 'Cryptography in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-08-cryptography.html',
                    description: 'Why BLS for QC and StateCertificate, signature comparison table (Ed25519, BLS, ECDSA), and where to look in the repo',
                    objectives: [
                        'Understand why BLS is used for quorum and state certificates',
                        'Compare signature schemes (table: pros/cons)',
                        'Find QC and StateCertificate types in the repo',
                        'Understand Ed25519 vs BLS roles (fast signing vs aggregation)'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 4,
                    id: 'intermediate-timing',
                    title: 'Timing: Rounds, Heights, Timeouts & Timers',
                    duration: '1–1.5 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-09-timing.html',
                    description: 'How height and round (view) work, timeouts and view change, Proposal and Cleanup timers, and where to look in the code',
                    objectives: [
                        'Understand height vs round (view) and how they drive BFT progress',
                        'Know how timeouts trigger round advancement (view change)',
                        'See how timers (Proposal, Cleanup) are set and fired',
                        'Map timing config and state to the codebase',
                        'Relate timing to liveness'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 4,
                    id: 'intermediate-performance',
                    title: 'Performance Measurement',
                    duration: '1–1.5 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-10-performance-measurement.html',
                    description: 'How performance is measured in simulation and production, what sim can miss vs real life, and recommendations for additional measures',
                    objectives: [
                        'Understand how performance is measured today (simulation and production)',
                        'Know what simulation metrics can miss compared to real deployment',
                        'Identify gaps and apply recommendations for additional performance measures'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-e2e-tests',
                    title: 'End-to-End Tests: Code ↔ Flow',
                    duration: '1–1.5 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-11-e2e-tests.html',
                    description: 'Trace one simulation E2E (single-shard tx) and one production runner test step-by-step: test call → protocol phase → crate and file; sim vs prod harness differences',
                    objectives: [
                        'Trace test_e2e_single_shard_transaction through SimulationRunner, IoLoop::step, and on_block_committed',
                        'Trace test_production_runner_with_network through ProductionRunner::build, genesis, and run_pinned_loop',
                        'Explain how production differs from simulation (time, network, storage, threading, batch flush)',
                        'Relate this trace to the full transaction flow module'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-project-01',
                    kind: 'project',
                    title: 'Hands-On Project 1: E2E Observability & Invariants',
                    duration: '1.5–2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/project-01-e2e-observability.html',
                    description: 'Edit the real single-shard E2E test: add trace markers, assert synchronized BFT heights across validators, and correlate SimulationStats with how much simulated time you grant—see outcomes change as you tighten the budget.',
                    objectives: [
                        'Run test_e2e_single_shard_transaction with cargo and --nocapture; map printed phases to the traced flow',
                        'Insert println! or tracing at genesis and submit boundaries and confirm ordering in output',
                        'After the first run_until, assert all validators share the same committed_height (deterministic sync invariant)',
                        'Print SimulationStats after that boundary; repeat with a much shorter run_until and interpret heights, stats, and any failures'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-libp2p',
                    title: 'libp2p: Transports, Identity, Security & Discovery',
                    duration: '2–2.5 hours',
                    difficulty: 'Intermediate',
                    path: 'intermediate/module-06-libp2p.html',
                    description: 'Transports (TCP, QUIC, WebSocket), PeerId and multiaddr, Noise and TLS, DHT and discovery',
                    objectives: [
                        'Understand transports and when to use which',
                        'Deepen PeerId and multiaddr',
                        'Understand security: Noise vs TLS 1.3',
                        'Learn stream multiplexing and protocol negotiation',
                        'Understand the DHT: Kademlia, peer and content routing'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-09',
                    title: 'Simulation & Testing: Deterministic Testing',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'intermediate/module-04-simulation.html',
                    description: 'Learn how deterministic simulation works and why it\'s powerful',
                    objectives: [
                        'Understand deterministic testing',
                        'Learn simulation runner',
                        'Write simulation tests',
                        'Debug consensus issues'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 5,
                    id: 'intermediate-10',
                    title: 'Hyperscale-rs Simulation Framework',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-09-simulation.html',
                    description: 'Learn to use and extend the hyperscale-rs simulation framework',
                    objectives: [
                        'Understand SimulationRunner',
                        'Learn event queue',
                        'Write simulation tests',
                        'Add network conditions'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 6,
                    id: 'intermediate-11',
                    title: 'Storage & Persistence: RocksDB & State Management',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'intermediate/module-05-storage.html',
                    description: 'Understand how blockchain state is stored and persisted',
                    objectives: [
                        'Understand RocksDB usage',
                        'Learn state persistence',
                        'Understand snapshots',
                        'Learn recovery mechanisms'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 6,
                    id: 'intermediate-12',
                    title: 'Storage in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-10-storage.html',
                    description: 'Understand storage implementation in hyperscale-rs',
                    objectives: [
                        'Understand RocksDB integration',
                        'Learn state persistence',
                        'Understand JVT snapshots',
                        'Learn recovery'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 6,
                    id: 'intermediate-13',
                    title: 'Contribution: Improve Mempool & Backpressure',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-11-mempool-contribution.html',
                    description: 'Contribute improvements to mempool and backpressure handling',
                    objectives: [
                        'Understand mempool design',
                        'Improve backpressure logic',
                        'Add metrics and monitoring',
                        'Submit meaningful PR'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 6,
                    id: 'intermediate-14',
                    title: 'Contribution: Enhance Simulation Framework',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-12-simulation-contribution.html',
                    description: 'Add features to simulation framework',
                    objectives: [
                        'Add new network conditions',
                        'Improve metrics collection',
                        'Add visualization',
                        'Submit PR'
                    ],
                    hyperscaleSpecific: true
                }
            ]
        },
        advanced: {
            title: 'Levels 7–11 — Advanced topics',
            description: 'Master advanced concepts, implement new features, and optimize performance (index Levels 7–11).',
            modules: [
                {
                    courseLevel: 7,
                    id: 'advanced-01',
                    title: 'Advanced Consensus: View Changes & Liveness',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-01-advanced-consensus.html',
                    description: 'Deep dive into view changes, timeouts, and liveness guarantees',
                    objectives: [
                        'Understand view change protocol',
                        'Learn timeout mechanisms',
                        'Understand liveness vs safety',
                        'Handle network partitions'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 7,
                    id: 'advanced-02',
                    title: 'View Changes in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-13-view-changes.html',
                    description: 'Understand view change implementation in hyperscale-rs',
                    objectives: [
                        'Understand implicit view changes',
                        'Learn round advancement',
                        'Understand timeout handling',
                        'Trace view change flow'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 7,
                    id: 'advanced-libp2p',
                    title: 'libp2p: Gossipsub, Production & Protocol Design',
                    duration: '2–2.5 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-09-libp2p.html',
                    description: 'GossipSub (mesh, graft, prune, PX, backoff), production concerns, protocol design on libp2p',
                    objectives: [
                        'Understand GossipSub in depth: mesh, graft, prune, PX, backoff',
                        'Relate topic-based meshes and control messages',
                        'Know hardening and attack resistance',
                        'Consider production: connectivity, NAT, metrics',
                        'Design protocols on libp2p and integrate with consensus'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 8,
                    id: 'advanced-03',
                    title: 'Performance Optimization: Profiling & Metrics',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-02-performance.html',
                    description: 'Learn to profile, measure, and optimize blockchain performance',
                    objectives: [
                        'Use profiling tools',
                        'Understand performance metrics',
                        'Identify bottlenecks',
                        'Optimize critical paths'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 8,
                    id: 'advanced-04',
                    title: 'Optimizing Hyperscale-rs Performance',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-14-performance.html',
                    description: 'Profile and optimize hyperscale-rs',
                    objectives: [
                        'Profile hyperscale-rs',
                        'Identify bottlenecks',
                        'Optimize critical paths',
                        'Measure improvements'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 8,
                    id: 'advanced-05',
                    title: 'Security in Blockchain Systems',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-03-security.html',
                    description: 'Learn security considerations in blockchain systems',
                    objectives: [
                        'Understand attack vectors',
                        'Learn about signature verification',
                        'Understand replay attacks',
                        'Learn about DoS prevention'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 8,
                    id: 'advanced-06',
                    title: 'Security in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-15-security.html',
                    description: 'Understand security implementation in hyperscale-rs',
                    objectives: [
                        'Understand attack mitigations',
                        'Learn signature verification',
                        'Understand replay protection',
                        'Learn DoS prevention'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 9,
                    id: 'advanced-07',
                    title: 'Scalability: Throughput & Latency Optimization',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-04-scalability.html',
                    description: 'Learn techniques to improve blockchain throughput and reduce latency',
                    objectives: [
                        'Understand throughput bottlenecks',
                        'Learn pipelining optimization',
                        'Optimize vote aggregation',
                        'Reduce commit latency'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 9,
                    id: 'advanced-08',
                    title: 'Scalability in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-16-scalability.html',
                    description: 'Optimize hyperscale-rs for throughput and latency',
                    objectives: [
                        'Understand pipelining',
                        'Optimize vote aggregation',
                        'Reduce commit latency',
                        'Improve throughput'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 9,
                    id: 'advanced-09',
                    title: 'Global Consensus: Epochs & Cross-Shard Coordination',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-05-global-consensus.html',
                    description: 'Learn about global consensus, epochs, and validator set changes',
                    objectives: [
                        'Understand epoch concept',
                        'Learn global consensus protocol',
                        'Understand validator set changes',
                        'Design epoch transition'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 9,
                    id: 'advanced-10',
                    title: 'Global Consensus in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-17-global-consensus.html',
                    description: 'Implement global consensus in hyperscale-rs',
                    objectives: [
                        'Design GlobalConsensusState',
                        'Implement epoch tracking',
                        'Handle validator set changes',
                        'Implement epoch transitions'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 10,
                    id: 'advanced-11',
                    title: 'Shard Management: Splitting & Merging',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-06-shard-management.html',
                    description: 'Understand dynamic sharding: how shards split and merge',
                    objectives: [
                        'Understand shard splitting',
                        'Learn shard merging',
                        'Handle state migration',
                        'Design shard management'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 10,
                    id: 'advanced-12',
                    title: 'Shard Management in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-18-shard-management.html',
                    description: 'Implement shard splitting and merging in hyperscale-rs',
                    objectives: [
                        'Design shard split protocol',
                        'Implement state migration',
                        'Handle shard merges',
                        'Add tests'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 10,
                    id: 'advanced-13',
                    title: 'Production Deployment & Operations',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-07-production.html',
                    description: 'Learn about running blockchain systems in production',
                    objectives: [
                        'Understand production considerations',
                        'Learn monitoring setup',
                        'Understand deployment strategies',
                        'Learn operational best practices'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 10,
                    id: 'advanced-14',
                    title: 'Hyperscale-rs Production Deployment',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-19-production.html',
                    description: 'Deploy and operate hyperscale-rs in production',
                    objectives: [
                        'Understand production runner',
                        'Set up monitoring',
                        'Deploy cluster',
                        'Operate validators'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 11,
                    id: 'advanced-15',
                    title: 'Advanced Testing: Property-Based & Fuzzing',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'advanced/module-08-advanced-testing.html',
                    description: 'Learn advanced testing techniques for blockchain systems',
                    objectives: [
                        'Understand property-based testing',
                        'Learn fuzzing techniques',
                        'Write comprehensive test suites',
                        'Find edge cases'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    courseLevel: 11,
                    id: 'advanced-16',
                    title: 'Advanced Testing for Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-20-advanced-testing.html',
                    description: 'Write advanced tests for hyperscale-rs',
                    objectives: [
                        'Write property-based tests',
                        'Add fuzzing',
                        'Test edge cases',
                        'Improve test coverage'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 11,
                    id: 'advanced-17',
                    title: 'Contribution: Implement Missing Features',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-21-feature-contribution.html',
                    description: 'Implement one of the TODO items in the codebase',
                    objectives: [
                        'Identify TODO items',
                        'Design implementation',
                        'Write comprehensive tests',
                        'Submit feature PR'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 11,
                    id: 'advanced-18',
                    title: 'Contribution: Performance Optimization',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-22-optimization-contribution.html',
                    description: 'Identify and optimize a performance bottleneck',
                    objectives: [
                        'Profile the system',
                        'Identify bottleneck',
                        'Implement optimization',
                        'Measure improvement',
                        'Submit PR'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    courseLevel: 11,
                    id: 'advanced-19',
                    title: 'Contribution: Complete Global Consensus Implementation',
                    duration: '1.5-2 hours',
                    difficulty: 'Advanced',
                    path: 'hyperscale-rs/module-23-global-consensus-contribution.html',
                    description: 'Complete the global consensus implementation',
                    objectives: [
                        'Implement epoch transitions',
                        'Add validator set changes',
                        'Write comprehensive tests',
                        'Submit major feature PR'
                    ],
                    hyperscaleSpecific: true
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