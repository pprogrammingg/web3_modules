(function() {
    // Hard quiz: answers are not straightforward; distractors require careful reading of the module and repo.
    var cryptoQuiz = [
        {
            question: "The QC holds one Bls12381G2Signature. Why is that sufficient to prove 2f+1 validators voted?",
            options: [
                "The single value is an aggregated signature: 2f+1 validators each signed the same message (e.g. block hash), and their BLS signatures were combined into one; verification uses the aggregated public key.",
                "The QC stores a hash of 2f+1 separate signatures to save space; verifiers recompute the hash.",
                "Only the leader's signature is needed because the leader speaks for the quorum.",
                "BLS allows one signature to count as 2f+1 after a threshold setup phase."
            ],
            correct: 0,
            explanation: "BLS same-message aggregation combines 2f+1 signatures on the same message into one signature; the QC stores that single aggregated signature and the corresponding aggregated public key. No hashing of N sigs; the leader does not substitute for the quorum; threshold is about aggregation, not a setup phase."
        },
        {
            question: "Why is the libp2p keypair derived from the BLS public key only (no secret)?",
            options: [
                "So anyone who knows a validator's BLS public key (e.g. from topology) can compute that validator's PeerId; the runner can fill validator_peers at startup without out-of-band PeerId exchange.",
                "Using the secret would be less secure because the secret could leak over the network.",
                "libp2p does not support key derivation from secret keys.",
                "The BLS secret key is too large to use as a seed for Ed25519."
            ],
            correct: 0,
            explanation: "Derivation from the public key only makes PeerId deterministic and computable by any node that has the validator set (topology). That enables filling validator_peers/peer_validators at startup. Security and key size are not the stated reasons; libp2p supports various key types."
        },
        {
            question: "In the types module, Ed25519 is described as for 'fast signing' and BLS for 'aggregatable signatures'. Where does the validator use Ed25519 for signing in Hyperscale-rs?",
            options: [
                "Ed25519 is used to sign block proposals so they are fast; BLS is used only for votes.",
                "The Ed25519 keypair is derived from the BLS public key and used only for libp2p transport (TLS, PeerId), not for signing consensus messages; consensus signing is BLS.",
                "Ed25519 signs transactions; BLS signs blocks and certificates.",
                "Ed25519 is used for local debug and testing; production uses BLS for everything."
            ],
            correct: 1,
            explanation: "The module states that the derived Ed25519 keypair is for libp2p (transport); BLS is the consensus identity (votes, QCs). Block proposals and consensus messages are not described as Ed25519-signed; tx signing is outside this module's scope."
        },
        {
            question: "What would break if we used the BLS secret key (instead of the public key) as input to derive_libp2p_keypair?",
            options: [
                "The derived Ed25519 key would be weaker because BLS and Ed25519 curves are incompatible.",
                "The PeerId would change every time the validator restarts.",
                "Other validators could not compute this validator's PeerId from topology alone, because they only have the BLS public key; validator_peers could not be filled at startup without the validator sending its PeerId out-of-band.",
                "libp2p would reject the key because it would not be deterministic."
            ],
            correct: 2,
            explanation: "The design relies on PeerId being computable from the public key only. If derivation used the secret, only the owning validator could compute its PeerId; others would not have the secret, so they could not populate validator_peers from topology. The other options misstate the design (determinism and compatibility)."
        },
        {
            question: "Why doesn't Hyperscale-rs use BLS directly for libp2p identity and TLS?",
            options: [
                "BLS is too slow for TLS handshakes, so Ed25519 is required for performance.",
                "BLS keys are too large for the PeerId format.",
                "Using BLS for both consensus and transport would create a single point of failure.",
                "libp2p's identity and TLS stack are built for key types like Ed25519, not BLS; deriving an Ed25519 key from the BLS identity lets the stack work without changing libp2p while keeping one logical identity."
            ],
            correct: 3,
            explanation: "The module says libp2p's identity and TLS are built for key types like Ed25519. The design choice is stack compatibility and one logical identity (BLS), with a derived Ed25519 key for transport. Performance and key size are not the stated reasons; single point of failure is a distractor."
        },
        {
            question: "How does the runner know which PeerId corresponds to which ValidatorId before any network messages are exchanged?",
            options: [
                "Each validator sends its PeerId in the first handshake; the runner caches it.",
                "The topology contains every validator's BLS public key; the runner computes each validator's PeerId via derive_libp2p_keypair (or compute_peer_id_for_validator) from that public key and fills validator_peers / peer_validators.",
                "PeerIds are assigned by a central registry that the runner queries at startup.",
                "ValidatorId and PeerId are the same value in Hyperscale-rs."
            ],
            correct: 1,
            explanation: "Because derivation uses only the BLS public key and topology has all public keys, the runner can compute every validator's PeerId at startup. No handshake or registry is needed; ValidatorId and PeerId are different types (one from BLS identity, one from derived Ed25519)."
        },
        {
            question: "StateCertificate and QuorumCertificate both use aggregated BLS signatures. What is the main difference in what they certify?",
            options: [
                "QC uses BLS and StateCertificate uses Ed25519 for speed.",
                "StateCertificate is produced by the leader only; QC is aggregated from votes.",
                "QC is constant size; StateCertificate grows with the number of validators.",
                "QC certifies that 2f+1 validators voted for a block (consensus); StateCertificate aggregates StateVoteBlocks (execution outcome for a block). Both use BLS aggregation but over different messages and roles."
            ],
            correct: 3,
            explanation: "Both use aggregated BLS (see types: quorum_certificate.rs and state.rs). They differ in purpose: QC for block votes in consensus, StateCertificate for execution (StateVoteBlocks). Neither is leader-only; both are aggregated and constant size."
        },
        {
            question: "If the committee size n increases (e.g. more validators), how does the size of a single QC change?",
            options: [
                "It grows linearly with n because we must include one signature per validator.",
                "It grows logarithmically with n due to Merkle aggregation.",
                "It doubles when n doubles because we store both the QC and a backup Ed25519 signature.",
                "It stays constant: one aggregated BLS signature (and aggregated public key); BLS aggregation means QC size does not grow with n."
            ],
            correct: 3,
            explanation: "The module states that QC size and verification cost do not grow with committee size; one 96-byte BLS G2 signature (and aggregated key) regardless of n. Linear growth would apply to storing N separate Ed25519 signatures."
        },
        {
            question: "The keygen binary in the repo generates a validator key. What does that key get used for in consensus and in the network layer?",
            options: [
                "Keygen produces two keys: one BLS for consensus and one Ed25519 for libp2p, stored together.",
                "The key is used only for consensus; libp2p generates a separate random key at runtime.",
                "The key is used only for libp2p; consensus uses a different key from the config file.",
                "One BLS key: used for consensus (votes, QCs, validator set). The same key's public part is used to derive the libp2p Ed25519 keypair for transport (PeerId, TLS); so one identity, two roles."
            ],
            correct: 3,
            explanation: "The design is one identity (BLS key from keygen), with the libp2p keypair derived from the BLS public key. Keygen does not produce two independent keys; the same BLS key underpins both consensus and the derived transport identity."
        },
        {
            question: "Why can BLS signatures be aggregated into one when validators sign the same message, but Ed25519 signatures cannot (in the same way)?",
            options: [
                "Ed25519 signatures are randomized so they cannot be combined; BLS signatures are deterministic.",
                "Ed25519 is used only for single-signer; BLS is defined only for multi-signer.",
                "Aggregation is a protocol layer above both; BLS was chosen for historical reasons in Hyperscale-rs.",
                "BLS has a mathematical structure (pairing-friendly curve) that allows combining multiple signatures on the same message into one signature verifiable under an aggregated public key; standard Ed25519 does not have that."
            ],
            correct: 3,
            explanation: "BLS on a pairing-friendly curve allows signature aggregation (same message) and verification under an aggregated public key. Ed25519 does not have that property in the same way. Determinism and 'multi-signer only' are not the correct distinctions; aggregation is a mathematical property of BLS."
        }
    ];

    initializeQuiz('quiz-cryptography', cryptoQuiz, 70);
})();
