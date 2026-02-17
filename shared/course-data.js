// Course data structure - organized by difficulty level.
// Single source of truth for module ids and paths; verify-paths.js derives its list from this file.
const COURSE_DATA = {
    levels: {
        basic: {
            title: 'Basic Level',
            description: 'Foundation concepts in blockchain, consensus, and distributed systems',
            modules: [
                {
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
                }
            ]
        },
        intermediate: {
            title: 'Intermediate Level',
            description: 'Dive deeper into implementation details and start making meaningful contributions',
            modules: [
                {
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
                    id: 'intermediate-01',
                    title: 'BFT Consensus Implementation Deep Dive',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-04-bft-implementation.html',
                    description: 'Understand how BFT consensus is implemented in hyperscale-rs',
                    objectives: [
                        'Understand block proposal flow',
                        'Learn vote collection and QC formation',
                        'Understand commit rules',
                        'Trace through actual code'
                    ],
                    hyperscaleSpecific: true
                },
                {
                    id: 'intermediate-02',
                    title: 'Sharding & Cross-Shard Transactions',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'intermediate/module-01-sharding.html',
                    description: 'Understand sharding concepts and cross-shard transaction protocols',
                    objectives: [
                        'Understand sharding concepts',
                        'Learn 2PC protocol',
                        'Understand provision coordination',
                        'Learn livelock prevention'
                    ],
                    hyperscaleSpecific: false
                },
                {
                    id: 'intermediate-03',
                    title: 'Cross-Shard Transactions in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-05-cross-shard.html',
                    description: 'Understand how hyperscale-rs handles cross-shard transactions',
                    objectives: [
                        'Understand 2PC in hyperscale-rs',
                        'Learn provision coordination',
                        'Understand livelock prevention',
                        'Trace cross-shard flow'
                    ],
                    hyperscaleSpecific: true
                },
                {
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
                    id: 'intermediate-08',
                    title: 'Cryptography in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-08-cryptography.html',
                    description: 'Understand cryptographic implementation in hyperscale-rs',
                    objectives: [
                        'Understand BLS signature usage',
                        'Learn QC formation',
                        'Understand vote verification',
                        'Learn key management'
                    ],
                    hyperscaleSpecific: true
                },
                {
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
                    id: 'intermediate-12',
                    title: 'Storage in Hyperscale-rs',
                    duration: '1.5-2 hours',
                    difficulty: 'Intermediate',
                    path: 'hyperscale-rs/module-10-storage.html',
                    description: 'Understand storage implementation in hyperscale-rs',
                    objectives: [
                        'Understand RocksDB integration',
                        'Learn state persistence',
                        'Understand JMT snapshots',
                        'Learn recovery'
                    ],
                    hyperscaleSpecific: true
                },
                {
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
            title: 'Advanced Level',
            description: 'Master advanced concepts, implement new features, and optimize performance',
            modules: [
                {
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