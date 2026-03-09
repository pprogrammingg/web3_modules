/**
 * Quiz: BFT mechanics — single-shard and multi-shard flow, data flow (module-04-bft-implementation.html).
 * Focus: understanding steps and where data lives, not Rust API. Pass threshold: 70%.
 */
(function() {
    var bftQuiz = [
        {
            question: "What do validators actually vote on in BFT consensus?",
            options: [
                "Each transaction in the block, one vote per tx",
                "The block (block hash): one BlockVote per validator for the whole block",
                "The state root after applying the block",
                "The proposer's signature"
            ],
            correct: 1,
            explanation: "Validators vote on the block (its hash) with a BlockVote. Consensus is on the block, not on individual transactions. Execution votes (StateVoteBlock) happen only after the block is committed."
        },
        {
            question: "Block N's body contains TransactionCertificates that describe the execution outcome of which block's transactions?",
            options: [
                "Block N's transactions",
                "Block N−1's (the parent block's) transactions",
                "The genesis block's transactions",
                "Block N+1's transactions"
            ],
            correct: 1,
            explanation: "Certificates in block N are the execution results of the transactions that were in block N−1. After N−1 is committed, validators run execution and produce StateVoteBlock → StateCertificate → TransactionCertificate; those certs are carried in block N and applied to the parent state root to get N's state root."
        },
        {
            question: "How is a block's state_root in the header computed?",
            options: [
                "From the parent_qc (the quorum certificate in the header)",
                "From this block's transaction list only",
                "parent_state_root + apply(certificates in this block), where those certificates are the execution outcomes of the parent block's transactions",
                "From the transaction root and parent hash"
            ],
            correct: 2,
            explanation: "parent_qc only attests to consensus on the previous block; it does not define state. The state root is computed by taking the parent block's state root and applying the TransactionCertificates in this block's body—and those certificates are exactly the execution outcomes of the parent block's txs."
        },
        {
            question: "In single-shard flow, when is a transaction considered finalized?",
            options: [
                "When the proposer includes it in a block",
                "When 2f+1 validators have sent a BlockVote for a block that contains it",
                "When the block that contains it is committed (finalized under the two-chain rule)",
                "When execution has produced a StateCertificate for it"
            ],
            correct: 2,
            explanation: "A transaction is finalized when the block that contains it is finalized. The block is finalized when it is committed (two-chain rule: it has a QC and the next block also has a QC). BlockVote and QC happen before commit; StateCertificate is produced after commit and goes in the next block."
        },
        {
            question: "Why does block vote (BlockVote → QC) happen before execution (StateVoteBlock → StateCertificate)?",
            options: [
                "So validators can run execution in parallel with voting",
                "So validators can agree on the block (order, contents) without having to run the block's transactions first; execution outcomes are then certified in the next phase",
                "Because StateCertificate is required to build the block header",
                "To reduce network messages"
            ],
            correct: 1,
            explanation: "Consensus first agrees on which block (vote on block hash). That way we don't tie consensus to execution speed or non-determinism. After the block is committed, everyone runs execution and certifies the outcomes (StateVoteBlock → StateCertificate → TransactionCertificate), which go in the next block."
        },
        {
            question: "A cross-shard transaction touches Shard 0 (source) and Shard 1 (target). When is the transaction as a whole finalized?",
            options: [
                "When Shard 0's block is finalized",
                "When Shard 1's block is finalized",
                "When both Shard 0's block and Shard 1's block that applies the receipt are finalized",
                "When a designated coordinator shard sends commit"
            ],
            correct: 2,
            explanation: "The transaction as a whole is finalized only when every block (and thus every sub-tx state) that contains a part of it is finalized. Here: source shard's block (original tx + receipt) and target shard's block (applying the receipt) must both be finalized."
        },
        {
            question: "What is a CommitmentProof, and how does it differ from a QuorumCertificate (QC)?",
            options: [
                "They are the same: both prove 2f+1 validators agreed",
                "QC proves consensus on a block (BlockVotes aggregated). CommitmentProof proves 2f+1 StateProvisions from a source shard, so the target shard can trust and apply the receipt",
                "CommitmentProof is the QC for the target shard's block",
                "CommitmentProof is produced by the target shard after it receives provisions"
            ],
            correct: 1,
            explanation: "QC = consensus layer (2f+1 BlockVotes for a block). CommitmentProof = cross-shard layer: aggregated 2f+1 StateProvisions from one source shard, so the target shard's block can include it and apply the receipt. Same quorum size, different thing being attested."
        },
        {
            question: "On the target shard, ProvisionCoordinator must have what before it can emit ProvisioningComplete for a cross-shard tx?",
            options: [
                "A commit message from a coordinator shard",
                "Quorum (2f+1) of StateProvisions from each required shard (every other participating shard)",
                "The source shard's block header only",
                "One StateProvision from the source shard"
            ],
            correct: 1,
            explanation: "ProvisionCoordinator keeps a checklist: for this tx, do we have quorum of StateProvisions from shard 0? From shard 1? … (required_shards = all other participating shards). Only when it has quorum from every required shard does it emit ProvisioningComplete. One provision is not enough. Hyperscale-rs has no 2PC coordinator; atomicity is provision-based."
        },
        {
            question: "Can provisions from two different source shards (e.g. shard 0 and shard 1) arrive in any order at a target shard (e.g. shard 2)?",
            options: [
                "No; they must arrive in protocol (shard-ID) order",
                "Yes; they can arrive in parallel. The target just needs quorum from each required shard before ProvisioningComplete",
                "No; they must be requested in protocol (shard-ID) order",
                "Only the first source shard's provisions matter"
            ],
            correct: 1,
            explanation: "Provisions from different source shards can arrive in parallel. ProvisionCoordinator waits until it has quorum from every required_shard—the order in which those provisions arrive doesn't matter. Protocol order (by shard ID) is used for deterministic agreement; provision arrival order is unconstrained."
        },
        {
            question: "What does parent_qc in the block header attest to, and what does it NOT define?",
            options: [
                "It attests to the state root and defines the previous block's execution results",
                "It attests that 2f+1 validators voted for the previous block (consensus); it does NOT define state—the block body's certificates do that",
                "It attests to the transaction order in the previous block",
                "It defines the next block's proposer"
            ],
            correct: 1,
            explanation: "parent_qc is the QuorumCertificate for the previous block: consensus proof that enough validators agreed on that block. It chains blocks (height, parent_hash). State is defined by applying this block's certificates (execution outcomes of the parent's txs) to the parent state root—certificates are in the block body, not in parent_qc."
        }
    ];

    if (typeof initializeQuiz === 'function') {
        initializeQuiz('quiz-bft', bftQuiz, 70);
    }
})();
