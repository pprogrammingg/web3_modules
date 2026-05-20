/**
 * EVM / Ethereum execution-layer protocol — interview-depth syllabus track.
 * Rust + protocol engineer framing; expands level-by-level over time.
 */
const EVM_COURSE_DATA = {
    courseLevelMeta: [
        {
            level: 1,
            title: 'Mental models & syllabus',
            careerBand: 'Protocol-literate reader',
            description:
                'Deterministic replicated state machine, EVM resources, gas, calls, rollups, DA, MEV—one map before deeper modules.'
        },
        {
            level: 2,
            title: 'Execution, mempool & L2 (Arbitrum)',
            careerBand: 'L2 / rollup interview depth',
            description:
                'Ethereum tx lifecycle, mempool, reorgs, 4844, sequencer mental models—then Arbitrum Nitro (Geth, WASM proving, inbox/outbox, BoLD).'
        }
    ],
    modules: [
        {
            courseLevel: 1,
            id: 'evm-l01-m01',
            title: 'Important background & concepts (syllabus)',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 1',
            path: 'evm/level-01/module-01-ethereum-evm-syllabus.html',
            description:
                '80/20 cheat sheet turned syllabus: execution vs consensus, storage/memory/calldata, gas, delegatecall, rollups, 4844, AA, Rust infra—fact-checked.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 2,
            id: 'evm-l02-m01',
            title: 'Ethereum execution, mempool & sequencer mental models',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 2',
            path: 'evm/level-02/module-01-ethereum-execution-mempool-sequencer.html',
            description:
                'Tx lifecycle, EVM pipeline, mempool dynamics, reorgs, calldata vs blobs (EIP-4844), L2 settlement & state roots—inherit vs optimize framing for rollup interviews.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 2,
            id: 'evm-l02-m02',
            title: 'Arbitrum Nitro architecture',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 2',
            path: 'evm/level-02/module-02-arbitrum-nitro-architecture.html',
            description:
                'Modified Geth + ArbOS, WASM proving, sequencer & inbox/outbox, delayed messages, retryable tickets, BoLD fraud proofs, optimistic rollup flow—how Ethereum compatibility is preserved while execution is optimized.',
            codingLab: true,
            contributionModule: false
        }
    ]
};
