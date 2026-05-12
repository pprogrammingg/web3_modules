/**
 * Cryptography for Blockchains & FinTech — parallel track (7 levels; three core modules per level plus optional Level 7 quantum primer).
 * Consumed by crypto-navigation.js and verify-paths.js.
 */
const CRYPTO_COURSE_DATA = {
    courseLevelMeta: [
        {
            level: 1,
            title: 'Foundations',
            careerBand: 'Crypto-literate engineer',
            description:
                'Hash functions, symmetric and public-key intuition—enough to read specs and threat models without getting lost in proofs.'
        },
        {
            level: 2,
            title: 'Signatures & identity',
            careerBand: 'Applied cryptographer (product-facing)',
            description:
                'Digital signatures, wallet-shaped key derivation, then a guided coding lab—sign and verify like real integrations.'
        },
        {
            level: 3,
            title: 'Merkle-shaped data',
            careerBand: 'Chain-aware builder',
            description:
                'Merkle trees, state-root thinking, and a small verifier toy—matches how L1/L2 clients talk about execution proofs.'
        },
        {
            level: 4,
            title: 'Thresholds & custody patterns',
            careerBand: 'Infra / custody mindset',
            description:
                'Secret sharing intuition, multisig vs threshold, and a hands-on policy demo—bridges FinTech key governance.'
        },
        {
            level: 5,
            title: 'ZK for architects',
            careerBand: 'Staff-minded protocol reader',
            description:
                'What ZK promises on-chain, circuit intuition without drowning in math, and a hello-world proving stack exercise.'
        },
        {
            level: 6,
            title: 'FinTech key ops',
            careerBand: 'Compliance-aware engineer',
            description:
                'HSM/KMS vocabulary, ceremonies and audit trails, and operational labs—how regulated apps ship crypto.'
        },
        {
            level: 7,
            title: 'Hardening & horizon',
            careerBand: 'Staff / principal-shaped review',
            description:
                'Side channels, post-quantum awareness for architects, optional quantum-crypto primer (QKD vs PQC), and a written capstone threat model—communication-heavy.'
        }
    ],
    modules: [
        // Level 1
        {
            courseLevel: 1,
            id: 'crypto-l01-m01',
            title: 'Hashing & commitments',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 1',
            path: 'crypto-fintech/level-01/module-01-hashing-commitments.html',
            description:
                'Collision resistance, domains separation, commitments—why hashes anchor blocks and wire protocols.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 1,
            id: 'crypto-l01-m02',
            title: 'Symmetric crypto & AEAD',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 1',
            path: 'crypto-fintech/level-01/module-02-symmetric-aead.html',
            description:
                'AES-GCM-style framing: nonces, tags, and why “encrypt” alone is never enough in APIs you ship.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 1,
            id: 'crypto-l01-m03',
            title: 'Public-key basics & DH framing',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 1',
            path: 'crypto-fintech/level-01/module-03-public-key-dh.html',
            description:
                'Discrete-log hardness intuition, ECDH key agreement—how TLS and wallets establish shared secrets.',
            codingLab: true,
            contributionModule: false
        },
        // Level 2
        {
            courseLevel: 2,
            id: 'crypto-l02-m01',
            title: 'Digital signatures in chains',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 2',
            path: 'crypto-fintech/level-02/module-01-digital-signatures.html',
            description:
                'ECDSA vs EdDSA ergonomics, replay domains, what validators verify vs what wallets sign.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 2,
            id: 'crypto-l02-m02',
            title: 'Keys, seeds & HD intuition',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 2',
            path: 'crypto-fintech/level-02/module-02-keys-hd-wallets.html',
            description:
                'BIP-39/32 at practitioner depth—derivation paths, why “one mnemonic” still means many secrets.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 2,
            id: 'crypto-l02-m03',
            title: 'Guided build — sign / verify CLI',
            duration: '~3–5 hr build',
            difficulty: 'Level 2 · Build',
            path: 'crypto-fintech/level-02/module-03-lab-sign-verify-cli.html',
            description:
                'Ship a tiny CLI: hash message, sign with secp256k1/ed25519 library, verify signatures—tests and README.',
            codingLab: true,
            contributionModule: true
        },
        // Level 3
        {
            courseLevel: 3,
            id: 'crypto-l03-m01',
            title: 'Merkle trees & inclusion',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 3',
            path: 'crypto-fintech/level-03/module-01-merkle-trees.html',
            description:
                'Binary Merkle trees, inclusion proofs, why rollups love Merkle roots for batches.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 3,
            id: 'crypto-l03-m02',
            title: 'State roots & tries (architect view)',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 3',
            path: 'crypto-fintech/level-03/module-02-state-tries.html',
            description:
                'Patricia / sparse intuition without implementing—reading Ethereum-style state commitments.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 3,
            id: 'crypto-l03-m03',
            title: 'Guided build — Merkle proof checker',
            duration: '~3–5 hr build',
            difficulty: 'Level 3 · Build',
            path: 'crypto-fintech/level-03/module-03-lab-merkle-verifier.html',
            description:
                'Given leaf + siblings + root, verify inclusion in Rust/Python—property tests for tampering.',
            codingLab: true,
            contributionModule: true
        },
        // Level 4
        {
            courseLevel: 4,
            id: 'crypto-l04-m01',
            title: 'Secret sharing intuition',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 4',
            path: 'crypto-fintech/level-04/module-01-secret-sharing.html',
            description:
                'Shamir t-of-n mental model—why custody uses polynomials under the hood.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 4,
            id: 'crypto-l04-m02',
            title: 'Multisig vs threshold (products)',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 4',
            path: 'crypto-fintech/level-04/module-02-multisig-threshold.html',
            description:
                'On-chain multisig contracts vs MPC clusters—trade-offs for FinTech teams.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 4,
            id: 'crypto-l04-m03',
            title: 'Guided build — policy / quorum demo',
            duration: '~3–5 hr build',
            difficulty: 'Level 4 · Build',
            path: 'crypto-fintech/level-04/module-03-lab-quorum-demo.html',
            description:
                'Simulate a t-of-n approval policy or toy Shamir reconstruction—document threat assumptions.',
            codingLab: true,
            contributionModule: true
        },
        // Level 5
        {
            courseLevel: 5,
            id: 'crypto-l05-m01',
            title: 'What ZK solves on-chain',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 5',
            path: 'crypto-fintech/level-05/module-01-zk-role.html',
            description:
                'Integrity vs privacy—SNARK/STARK positioning for rollups without proving theorems.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 5,
            id: 'crypto-l05-m02',
            title: 'Circuits & arithmetization sketch',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 5',
            path: 'crypto-fintech/level-05/module-02-circuits-intro.html',
            description:
                'R1CS/QAP vocabulary at architect depth—enough to talk to circuit engineers.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 5,
            id: 'crypto-l05-m03',
            title: 'Guided build — Circom hello / verifier walk',
            duration: '~4–6 hr build',
            difficulty: 'Level 5 · Build',
            path: 'crypto-fintech/level-05/module-03-lab-circom-hello.html',
            description:
                'Compile a tiny circuit, generate proof, verify locally—pin versions in README.',
            codingLab: true,
            contributionModule: true
        },
        // Level 6
        {
            courseLevel: 6,
            id: 'crypto-l06-m01',
            title: 'HSM / KMS patterns',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 6',
            path: 'crypto-fintech/level-06/module-01-hsm-kms.html',
            description:
                'Envelope encryption, key rotation, dual controls—mapping cloud KMS to chain custody.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 6,
            id: 'crypto-l06-m02',
            title: 'Ceremonies, audits & FinTech gates',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 6',
            path: 'crypto-fintech/level-06/module-02-ceremonies-audit.html',
            description:
                'How regulated apps prove controls—SOC narratives meet cryptographic reality.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 6,
            id: 'crypto-l06-m03',
            title: 'Guided build — timing-safe compare & checklist',
            duration: '~3–5 hr build',
            difficulty: 'Level 6 · Build',
            path: 'crypto-fintech/level-06/module-03-lab-secure-compare.html',
            description:
                'Implement constant-time compare for MACs + publish an ops checklist for key-handling drills.',
            codingLab: true,
            contributionModule: true
        },
        // Level 7
        {
            courseLevel: 7,
            id: 'crypto-l07-m01',
            title: 'Side channels & implementation realism',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 7',
            path: 'crypto-fintech/level-07/module-01-side-channels.html',
            description:
                'Timing leaks, speculative execution basics—why crypto libraries warn about branching on secrets.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 7,
            id: 'crypto-l07-m02',
            title: 'Post-quantum for architects',
            duration: '~2 hr (4×25 min)',
            difficulty: 'Level 7',
            path: 'crypto-fintech/level-07/module-02-post-quantum.html',
            description:
                'Harvest-now/decrypt-later, hybrid KEM framing—roadmaps without claiming math expertise.',
            codingLab: true,
            contributionModule: false
        },
        {
            courseLevel: 7,
            id: 'crypto-l07-m03',
            title: 'Capstone — threat model & mitigations',
            duration: '~4–8 hr write + review',
            difficulty: 'Level 7 · Capstone',
            path: 'crypto-fintech/level-07/module-03-capstone-threat-model.html',
            description:
                'Pick a realistic wallet/custody/Rollup verifier scenario—document threats, crypto controls, residual risk.',
            codingLab: false,
            contributionModule: true
        },
        {
            courseLevel: 7,
            id: 'crypto-l07-m04',
            title: 'Quantum cryptography — small primer',
            duration: '~1.5 hr (4×20 min)',
            difficulty: 'Level 7 · Primer',
            path: 'crypto-fintech/level-07/module-04-quantum-cryptography-primer.html',
            description:
                'QKD vs PQC vs “quantum hype”: vocabulary for architects—what breaks, what does not, and how this sits next to post-quantum migration.',
            codingLab: true,
            contributionModule: false
        }
    ]
};

if (typeof window !== 'undefined') {
    window.CRYPTO_COURSE_DATA = CRYPTO_COURSE_DATA;
}
