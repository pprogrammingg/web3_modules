/**
 * Zero-Knowledge for Blockchains — parallel track (7 levels × 3 modules).
 * Architect / builder depth: proofs, rollups, tooling—not a pure math course.
 */
const ZK_COURSE_DATA = {
    courseLevelMeta: [
        {
            level: 1,
            title: 'ZK vocabulary & mental models',
            careerBand: 'Protocol-literate reader',
            description:
                'What SNARKs/STARKs promise, how constraints feel in practice, and why rollups obsess over verification cost.'
        },
        {
            level: 2,
            title: 'Circuits & tooling',
            careerBand: 'Hands-on prover stack',
            description:
                'R1CS-shaped thinking, witnesses, Circom/Halo2-class workflows—then ship a minimal compile + verify loop.'
        },
        {
            level: 3,
            title: 'Proof systems & commitments',
            careerBand: 'Systems comparer',
            description:
                'Trusted setup vs transparent proofs, polynomial commitments—enough to read roadmap posts and audit summaries.'
        },
        {
            level: 4,
            title: 'Validity & rollups',
            careerBand: 'L2-aware engineer',
            description:
                'zkRollup / zkEVM narratives, data availability touchpoints, reading verifier contracts without drowning.'
        },
        {
            level: 5,
            title: 'Privacy, recursion, product trade-offs',
            careerBand: 'Staff-shaped reasoning',
            description:
                'Privacy pools vs compliance tension, recursive proof intuition—business + tech framing.'
        },
        {
            level: 6,
            title: 'Integration safety',
            careerBand: 'Ship-it carefully',
            description:
                'Common failure modes in ZK integrations, testing and audit expectations—checklists over hype.'
        },
        {
            level: 7,
            title: 'Capstone',
            careerBand: 'Architect review',
            description:
                'Consolidate into a written design / threat review—communication-heavy deliverable.'
        }
    ],
    modules: [
        {
            courseLevel: 1,
            id: 'zk-l01-m01',
            title: 'SNARKs, STARKs & the trust ladder',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 1',
            path: 'zk/level-01/module-01-snark-stark-map.html',
            description:
                'Naming map: SNARK vs STARK vs “bullet” proofs—what varies (setup, quantum, proof size, prover time).',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 1,
            id: 'zk-l01-m02',
            title: 'Arithmetic circuits without the PhD',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 1',
            path: 'zk/level-01/module-02-circuits-intuition.html',
            description:
                'Constraints = equations over a field; witnesses = satisfying assignments—bridge to programs you can compile.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 1,
            id: 'zk-l01-m03',
            title: 'Finite fields & curves (practitioner depth)',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 1',
            path: 'zk/level-01/module-03-fields-curves-practice.html',
            description:
                'Why BN254/BLS12-381 show up; pairing intuition at API level—no curve arithmetic exams.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 2,
            id: 'zk-l02-m01',
            title: 'R1CS / QAP sketch',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 2',
            path: 'zk/level-02/module-01-r1cs-qap.html',
            description:
                'From program to constraints to polynomial story—enough to follow Circom/R1CS docs.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 2,
            id: 'zk-l02-m02',
            title: 'Witnesses, compilation & dev UX',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 2',
            path: 'zk/level-02/module-02-witness-tooling.html',
            description:
                'inputs.json, symbol files, debugging failed constraints—productive toolchain habits.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 2,
            id: 'zk-l02-m03',
            title: 'Guided build — Circom compile + verify',
            duration: '~3–6 hr build',
            difficulty: 'Level 2 · Build',
            path: 'zk/level-02/module-03-lab-circom-verify.html',
            description:
                'Minimal circuit, trusted setup artifacts (or test harness), verify locally—README with pinned versions.',
            codingLab: true,
            contributionModule: true
        },
        {
            courseLevel: 3,
            id: 'zk-l03-m01',
            title: 'Trusted setup ceremonies vs transparent proofs',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 3',
            path: 'zk/level-03/module-01-trusted-setup-transparent.html',
            description:
                'Toxic waste, MPC ceremonies, FRI/STARK transparency—how teams talk about trust assumptions.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 3,
            id: 'zk-l03-m02',
            title: 'Polynomial commitments (architect view)',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 3',
            path: 'zk/level-03/module-02-pcs-intuition.html',
            description:
                'Why PCS shows up in modern SNARKs; KZG vs FRI at headline level—ties to DA/cost essays.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 3,
            id: 'zk-l03-m03',
            title: 'Guided build — benchmark prove vs verify',
            duration: '~3–5 hr build',
            difficulty: 'Level 3 · Build',
            path: 'zk/level-03/module-03-lab-bench-prove-verify.html',
            description:
                'Script benchmarks for your Level 2 circuit; chart proof size + verify time vs input size.',
            codingLab: true,
            contributionModule: true
        },
        {
            courseLevel: 4,
            id: 'zk-l04-m01',
            title: 'Validity rollups & zkEVM narratives',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 4',
            path: 'zk/level-04/module-01-validity-zkevm.html',
            description:
                'State diff vs full EVM emulation stories—what “zkEVM” claims usually mean in engineering.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 4,
            id: 'zk-l04-m02',
            title: 'Data availability + proofs',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 4',
            path: 'zk/level-04/module-02-da-proofs.html',
            description:
                'Why posting data matters; validity vs sovereign vs optimistic hybrids at headline level.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 4,
            id: 'zk-l04-m03',
            title: 'Guided build — read a verifier path',
            duration: '~4–6 hr build',
            difficulty: 'Level 4 · Build',
            path: 'zk/level-04/module-03-lab-verifier-trace.html',
            description:
                'Pick a small on-chain or Rust verifier tutorial—document calldata/inputs and one verification call path.',
            codingLab: true,
            contributionModule: true
        },
        {
            courseLevel: 5,
            id: 'zk-l05-m01',
            title: 'Privacy pools & compliance tension',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 5',
            path: 'zk/level-05/module-01-privacy-compliance.html',
            description:
                'Why privacy tech intersects policy; product language vs cryptography guarantees.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 5,
            id: 'zk-l05-m02',
            title: 'Recursive proofs (intuition)',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 5',
            path: 'zk/level-05/module-02-recursion-intuition.html',
            description:
                'Proof of proof storylines; where recursion buys throughput vs complexity.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 5,
            id: 'zk-l05-m03',
            title: 'Guided build — recursion or rollup note',
            duration: '~4–8 hr build',
            difficulty: 'Level 5 · Build',
            path: 'zk/level-05/module-03-lab-recursion-or-note.html',
            description:
                'Either a tiny recursive demo with maintained tooling OR a crisp engineering note comparing two recursion approaches.',
            codingLab: true,
            contributionModule: true
        },
        {
            courseLevel: 6,
            id: 'zk-l06-m01',
            title: 'Integration pitfalls in ZK apps',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 6',
            path: 'zk/level-06/module-01-integration-pitfalls.html',
            description:
                'Soundness vs completeness bugs, hint misuse, trusted parameter handling—war stories pattern.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 6,
            id: 'zk-l06-m02',
            title: 'Testing & audit expectations',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 6',
            path: 'zk/level-06/module-02-testing-audit-zk.html',
            description:
                'Property tests, differential checks, formal toolchains at headline—what audits ask for.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 6,
            id: 'zk-l06-m03',
            title: 'Guided build — audit checklist + toy review',
            duration: '~4–6 hr build',
            difficulty: 'Level 6 · Build',
            path: 'zk/level-06/module-03-lab-audit-checklist.html',
            description:
                'Produce a one-page checklist for integrating a Groth16-style verifier; run it against a sample repo.',
            codingLab: true,
            contributionModule: true
        },
        {
            courseLevel: 7,
            id: 'zk-l07-m01',
            title: 'ZK roadmap literacy (2026+)',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 7',
            path: 'zk/level-07/module-01-roadmap-literacy.html',
            description:
                'Hardware acceleration, new PCS families, standardization efforts—how to follow without hype.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 7,
            id: 'zk-l07-m02',
            title: 'Quantum threat & hybrid KEM framing',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 7',
            path: 'zk/level-07/module-02-pq-framing.html',
            description:
                'ZK vs PQ confusion clearing—what architects migrate first (often signatures/KEM), not circuit math.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 7,
            id: 'zk-l07-m03',
            title: 'Capstone — ZK feature design review',
            duration: '~6–12 hr write',
            difficulty: 'Level 7 · Capstone',
            path: 'zk/level-07/module-03-capstone-zk-design-review.html',
            description:
                'Pick a realistic product (rollup bridge, private vote, verified batch)—threat model + crypto assumptions + rollout risks.',
            codingLab: false,
            contributionModule: true
        }
    ]
};

if (typeof window !== 'undefined') {
    window.ZK_COURSE_DATA = ZK_COURSE_DATA;
}
