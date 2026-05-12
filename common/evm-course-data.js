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
        }
    ]
};
