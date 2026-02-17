# Basic level: Hyperscale modules and transaction flow

This section gives the **biggest picture** first (end-to-end transaction flow), then **crate groupings** with one-liners for code reading, then **practical hands-on** next steps. Simulation, spammer, test-helpers, and related tooling are covered in **Intermediate** and **Advanced** modules (see end of this doc).

---

## 1. Transaction flow: biggest picture (end-to-end)

From user submit to finalized, in one view:

1. **Submit & gossip** — User submits tx to a node (RPC). That node gossips the tx to **all shards that have an interest** (from declared reads/writes). Validators on those shards add the tx to their **mempool** if their shard is involved. Status: **Pending**.

2. **Propose** — On each shard, one **proposer** per (height, round) is chosen (round-robin). The proposer gets **ready transactions** from the mempool, builds a **block** (parent QC, transactions, certificates, deferred/aborted), and **broadcasts** the block to the shard.

3. **Vote & QC** — Other validators **verify** the block (state root, tx root, parent QC), then each sends a **BlockVote**. When **2f+1** votes are collected, a **Quorum Certificate (QC)** is built. The next block references that QC as `parent_qc`.

4. **Commit** — The **2-chain rule**: a block is **committed** when a *child* block has a QC. So the chain advances one committed block at a time. On commit: **BlockCommitted** is emitted; mempool marks the tx **Committed(height)**; **execution** runs for all txs in the block.

5. **Execute** — **Single-shard**: execute locally, produce **StateVoteBlock**, aggregate to **StateCertificate**, then **TransactionCertificate**. **Cross-shard**: **source** shards send **StateProvision** to **target** shard; target collects 2f+1 provisions per source, executes, then same vote/certificate flow. Execution emits **TransactionExecuted**; mempool marks **Executed**.

6. **Finalize** — A **later block** includes the **TransactionCertificate** in `block.certificates`. When that block commits, state writes are applied (**PersistTransactionCertificate**); mempool marks **Completed**. The tx is **final**.

So: **Pending → Committed → Executed → Completed**. (Other outcomes: Deferred, Retried, Aborted.)

---

## 2. Crates grouping and one-liners

**Recommended code reading:** the crates below are grouped by **transaction-flow progression**. Overlap between groups is intentional. Read the groups in order (1 → 6); use the quizzes after each group to check understanding.

| Group | Crates | One-liner |
|-------|--------|-----------|
| **1. First contact** | `hyperscale-production`, `hyperscale-node`, `hyperscale-mempool`, `hyperscale-types`, `hyperscale-core`, `hyperscale-messages` | *Want to see how Hyperscale receives a transaction at the RPC and gets it into the right shards’ mempools? Start here.* |
| **2. Sharding and routing** | `hyperscale-types`, `hyperscale-core`, `hyperscale-node` | *Once a transaction is decomposed into NodeIds and each shard is responsible for a slice of state, these crates define who does what and where the tx is stored.* |
| **3. Proposing and building blocks** | `hyperscale-bft`, `hyperscale-mempool`, `hyperscale-types`, `hyperscale-core` | *How does one validator become the proposer and assemble the next block from the mempool? BFT and mempool have the answer.* |
| **4. Voting and committing** | `hyperscale-bft`, `hyperscale-types`, `hyperscale-core` | *How do validators agree on a block, and when is it finally committed? Follow votes and quorum certificates.* |
| **5. Execution after commit** | `hyperscale-execution`, `hyperscale-engine`, `hyperscale-node`, `hyperscale-types`, `hyperscale-core` | *Once a block is committed, who runs the transactions and how do single-shard and cross-shard paths diverge?* |
| **6. Cross-shard: provisions and livelock** | `hyperscale-provisions`, `hyperscale-execution`, `hyperscale-livelock`, `hyperscale-types`, `hyperscale-core` | *How does state move between shards for cross-shard transactions, and how does Hyperscale avoid deadlock? Provisions and livelock crates hold the answer.* |

---

## 3. Practical hands-on next steps

- **Read `Event` and `Action` early.** The flow is “event in → state machine → actions out; runner performs actions and feeds back events.” Skim `core::event` and `core::action` (e.g. `action.rs` / `event.rs`) before deep-diving each group.
- **Follow one tx with a debugger.** Pick one transaction hash; break on `SubmitTransaction` / `TransactionGossipReceived`, then `BlockCommitted`, then `TransactionExecuted`, then certificate in block and `Completed`. That ties all six groups into one path.
- **Production runner is large.** Use the table above to jump to “first contact” (RPC handler, submit path, gossip) and “actions to network” (e.g. `BroadcastToShard` handling) instead of reading `hyperscale-production` top to bottom.
- **Where to look when things go wrong:** tx stuck in Pending → mempool and gossip; block not committing → BFT and QC; cross-shard tx stuck in Executed → certificates and inclusion in blocks.

---

## Group 1: First contact

## Group 1: First contact

**Crates:** `hyperscale-production`, `hyperscale-node`, `hyperscale-mempool`, `hyperscale-types`, `hyperscale-core`, `hyperscale-messages`

**One-liner:** *Want to see how Hyperscale receives a transaction at the RPC and gets it into the right shards’ mempools? Start here.*

- **production**: RPC handlers (submit tx), runner that dispatches to state machine and gossips to shards.
- **node**: `NodeStateMachine` routes events (e.g. `SubmitTransaction`, `TransactionGossipReceived`) and calls mempool/BFT/execution.
- **mempool**: Pool per validator, `on_submit_transaction_arc`, `on_transaction_gossip_arc`, `involves_local_shard` gating.
- **types**: `RoutableTransaction`, `declared_reads` / `declared_writes`, topology and shard helpers.
- **core**: `Event`, `Action` (e.g. `BroadcastToShard`, `EmitTransactionStatus`).
- **messages**: `TransactionGossip`, `OutboundMessage`, batching/serialization.

### Quiz: Group 1 (First contact)

1. The production runner sends the tx to the state machine as `SubmitTransaction` only after (or alongside) gossiping. Why must gossip happen before or with the state-machine event, and what breaks if a validator adds the tx to its mempool but never gossips?
2. When `Event::TransactionGossipReceived` is handled, the node only calls `mempool.on_transaction_gossip_arc` if `topology.involves_local_shard(tx)`. What is the exact definition of “involves local shard” in code, and why is it correct to skip mempool insertion when it is false?
3. For the same transaction hash, can one validator have it in the mempool with `submitted_locally: true` and another with `submitted_locally: false`? When does each occur and why does the code track this flag?
4. `PoolEntry` stores `cross_shard: bool` derived from `tx.is_cross_shard(num_shards)`. `is_cross_shard` is defined only from `declared_writes`. Why not use `declared_reads` in that predicate, and what would go wrong if we did?
5. If the RPC handler returns 202 Accepted, does that guarantee the transaction will eventually be proposed in a block? What conditions could prevent it from ever entering a block?
6. The runner “gossips to all relevant shards.” How does it decide which shards are relevant for a given transaction, and where is that set computed (which crate / type)?
7. When a validator receives `TransactionGossipReceived` for a tx it already has in the mempool (same hash), what does the mempool do and why?
8. `EmitTransactionStatus` is an action that updates the RPC status cache. At “first contact” (submit or gossip receive), what status is emitted and does it differ for the submitting node vs other nodes?
9. In production, are transactions from RPC and from gossip encoded and sent over the network in the same message type? Where is that message type defined and what is the topic/routing for it?
10. If the mempool is at `rpc_mempool_limit`, what happens to a new RPC submission and what happens to the same tx arriving via gossip on the same node?

---

## Group 2: Sharding and routing

**Crates:** `hyperscale-types`, `hyperscale-core`, `hyperscale-node`

**One-liner:** *Once a transaction is decomposed into NodeIds and each shard is responsible for a slice of state, these crates define who does what and where the tx is stored.*

- **types**: `shard_for_node`, `Topology`, `consensus_shards` / `provisioning_shards` / `all_shards_for_transaction`, `RoutableTransaction`.
- **core**: Actions that are shard-aware (e.g. `BroadcastToShard { shard, message }`).
- **node**: Uses `topology.involves_local_shard(tx)` and routes events to the right sub-state machines.

### Quiz: Group 2 (Sharding and routing)

1. `consensus_shards(tx)` is defined as the set of shards of `declared_writes`; `provisioning_shards(tx)` is the set of shards of `declared_reads` that are not in the write set. Give an example of a tx where `provisioning_shards` is non-empty but `consensus_shards` has exactly one shard. Why is that tx still “cross-shard” from an execution perspective?
2. If a transaction has `declared_writes` empty (read-only), how does `is_cross_shard` behave and why is that the right rule for the mempool and BFT?
3. `shard_for_node(node_id, num_shards)` uses `blake3::hash(&node_id.0)`. Why use a hash of the NodeId rather than, say, the first byte of the NodeId for shard assignment?
4. Can the same NodeId ever map to different shards on two validators? Under what conditions (e.g. epoch change, shard split) might “the shard for this NodeId” change?
5. When the node routes `SubmitTransaction` to the mempool, it only does so if `involves_local_shard(tx)`. So the submitting validator might not add the tx to its own mempool. When would that happen and how does the tx still get proposed?
6. `all_shards_for_transaction(tx)` is used for gossip targets. Is it always exactly `consensus_shards ∪ provisioning_shards`? Prove or give a counterexample.
7. Why does the codebase use `ShardGroupId` instead of raw `u64` for shard identity, and where is the conversion from validator index to `ShardGroupId` defined for static topology?
8. For a cross-shard tx, “target shard” (executor) and “source shard” (provisioner) are defined in execution/provisions. In the types/topology API, is there a single method that returns “target shard” for execution, or do you have to derive it from consensus_shards/provisioning_shards? Where is that derivation done?
9. If `num_shards` is 1, every NodeId maps to shard 0. What happens to `provisioning_shards` and cross-shard 2PC in that case?
10. The BFT module uses `local_shard()` from topology. Does BFT ever need to know about a *remote* shard’s chain or state, and if so, where does that cross-shard awareness appear in the node/BFT boundary?

---

## Group 3: Proposing and building blocks

**Crates:** `hyperscale-bft`, `hyperscale-mempool`, `hyperscale-types`, `hyperscale-core`

**One-liner:** *How does one validator become the proposer and assemble the next block from the mempool? BFT and mempool have the answer.*

- **bft**: Proposer selection `(height + round) % committee.len()`, `ProposalTimer`, requesting `ready_txs` from mempool, `BuildProposal` action with parent state root and certificates.
- **mempool**: `ready_transactions(max_count, pending_commit_tx_count, pending_commit_cert_count)`, retries / priority / others, in-flight limits.
- **types**: `Block`, `BlockHeader`, `RoutableTransaction`, certificate and deferral types.
- **core**: `Action::BuildProposal`, `SetTimer` / `CancelTimer`.

### Quiz: Group 3 (Proposing and building blocks)

1. The proposer calls `mempool.ready_transactions(max_txs, pending_txs, pending_certs)` where `pending_txs` and `pending_certs` come from BFT’s view of the pipeline. Why must the mempool be told about pending (uncommitted) block contents, and what invariant would break if we used `ready_transactions(max_txs, 0, 0)`?
2. `BuildProposal` requires `parent_state_root` and `parent_state_version`. The runner may wait until the local JMT reaches that state or timeout. Why can’t the proposer always use “current local JMT root” instead of the parent block’s header?
3. What is the exact order of sections in a block (retry / priority / normal transactions, certificates, deferred, aborted), and where is that order enforced in code?
4. If the proposer is syncing (`syncing == true`), what kind of block does it build and what does it contain (transactions, certificates)?
5. The mempool returns `ReadyTransactions { retries, priority, others }`. What makes a tx “priority” vs “others,” and why do priority txs bypass the soft in-flight limit?
6. Proposer selection is deterministic per (height, round). If the designated proposer is slow or partitioned, how does the chain eventually advance? Which event or timer drives round change?
7. `BuildProposal` receives `commitment_proofs` for some of the ready transactions. What are commitment proofs used for in the block, and which component builds them before the proposal?
8. Deferrals proposed in a block must have a `CycleProof` with enough signers. Where does the proposer filter out deferrals with insufficient signers, and why would a validator reject a block with a weak CycleProof?
9. The block header includes `state_root` and `state_version`. At proposal time, does the proposer compute the new state root by applying certificates to the parent state, or does the runner do it inside `BuildProposal`? Where is that contract documented?
10. What is the maximum number of certificates and the maximum number of transactions per block, and where are these limits configured and enforced?

---

## Group 4: Voting and committing

**Crates:** `hyperscale-bft`, `hyperscale-types`, `hyperscale-core`

**One-liner:** *How do validators agree on a block, and when is it finally committed? Follow votes and quorum certificates.*

- **bft**: Block verification (state root, tx root, parent QC), `BlockVote`, collection and `VerifyAndBuildQuorumCertificate`, 2-chain commit rule, `BlockCommitted` and chain advancement.
- **types**: `QuorumCertificate`, `BlockVote`, signing message format, `BlockHeader`.
- **core**: `Action::VerifyQcSignature`, `Action::VerifyAndBuildQuorumCertificate`, `Action::PersistAndBroadcastVote`, `Event::BlockCommitted`.

### Quiz: Group 4 (Voting and committing)

1. The 2-chain rule: a block B is committed when there exists a child block whose QC certifies B. So the *latest* block in the chain is not committed until the *next* block has a QC. Why design it this way instead of committing as soon as B has a QC?
2. When a validator receives a block, it may have to wait for “JMT at parent state root” before it can verify the block’s state root. Where is that wait implemented (which action or event), and what happens if the wait times out?
3. `VerifyQcSignature` is described as critical for BFT safety. What attack becomes possible if a malicious proposer could include a block with a QC that was never actually signed by 2f+1 validators, and we skipped this verification?
4. Votes are persisted before broadcast (`PersistAndBroadcastVote`). Why must persistence complete before the vote is sent over the network?
5. After a block is committed, the node emits `BlockCommitted` and passes the block to execution. Does the BFT state machine also update its “committed height” in the same event handling path, and what would go wrong if execution ran before BFT updated committed height?
6. If two blocks at the same height get quorum (e.g. due to view change and equivocation), how does the protocol ensure only one commit at that height? Where is “committed block” uniquely determined?
7. The signing message for a block vote includes shard_group_id, height, round, block_hash. Why include round and not only height and block_hash?
8. When a validator builds a QC from collected votes, it uses `VerifyAndBuildQuorumCertificate` which batch-verifies and aggregates. What does the state machine receive back (event type) when quorum is not yet reached, and how does it use that to avoid re-verifying the same votes later?
9. Genesis block has a special QC. How is the parent of the first real block (height 1) represented in the BFT state and in the block header?
10. Sync: when a node is behind and receives `SyncBlockReadyToApply`, does it commit blocks one by one through the same 2-chain logic, or is there a separate “sync commit” path? Where is that distinction in the code?

---

## Group 5: Execution after commit

**Crates:** `hyperscale-execution`, `hyperscale-engine`, `hyperscale-node`, `hyperscale-types`, `hyperscale-core`

**One-liner:** *Once a block is committed, who runs the transactions and how do single-shard and cross-shard paths diverge?*

- **execution**: `on_block_committed`, split single-shard vs cross-shard, single-shard execution and `StateVoteBlock`, cross-shard registration and 2PC phases.
- **engine**: Radix Engine integration, `execute_single_shard`, execution output and state writes.
- **node**: Dispatches `BlockCommitted` to execution, handles `TransactionExecuted` and certificate feedback to BFT/mempool.
- **types**: `StateVoteBlock`, `StateCertificate`, `TransactionCertificate`, `TransactionDecision`, execution-related actions/events.
- **core**: `ExecuteTransactions`, `BroadcastStateVote`, `AggregateStateCertificate`, `EmitCommittedBlock`, etc.

### Quiz: Group 5 (Execution after commit)

1. When `on_block_committed` runs, transactions are partitioned into single-shard and cross-shard using `is_single_shard(tx)`. Is that the same as `!tx.is_cross_shard(num_shards)` (from types), or does execution use a different notion of “single shard”? Where is the partition done?
2. For single-shard transactions, the node may have already run “speculative execution” when the block header arrived (before commit). How does execution state know to skip re-execution when speculative votes were already sent, and where is that tracked?
3. The status flow is Pending → Committed → Executed → Completed. At which exact event does the mempool transition from Committed to Executed, and which component emits that event?
4. State writes from a `TransactionCertificate` are applied only when the certificate is *in a committed block*. So there are two commits: (1) block with tx commits, (2) later block with certificate commits. Why not apply state as soon as the certificate is built?
5. `TransactionCertificate` aggregates `StateCertificate`s from multiple shards. If one shard’s execution rejects (success=false), how is that reflected in the final `TransactionCertificate` and in the mempool status?
6. The execution layer emits `TransactionExecuted { tx_hash, accepted }`. Who consumes this event (which state machines) and what do they do with it?
7. “Committed” block is persisted and then execution runs. Is execution triggered synchronously in the same call stack as “block committed” handling in the node, or is it asynchronous (e.g. runner sends an event later)?
8. The engine’s `execute_single_shard` takes a storage snapshot. Where does that snapshot’s state root come from (parent block, or current JMT), and why?
9. For single-shard txs, validators produce `StateVoteBlock` and aggregate to `StateCertificate`. Is that aggregation done inside the execution crate or in the node/BFT? Where is `AggregateStateCertificate` action emitted?
10. When a block commits, execution receives *all* transactions in the block (not just those that touch the local shard). How does execution avoid running or voting on transactions that don’t involve the local shard?

---

## Group 6: Cross-shard (provisions and livelock)

**Crates:** `hyperscale-provisions`, `hyperscale-execution`, `hyperscale-livelock`, `hyperscale-types`, `hyperscale-core`

**One-liner:** *How does state move between shards for cross-shard transactions, and how does Hyperscale avoid deadlock? Provisions and livelock crates hold the answer.*

- **provisions**: `ProvisionCoordinator`, receiving and buffering `StateProvision`, quorum per source shard, `VerifyAndAggregateProvisions`, `CommitmentProof`.
- **execution**: Cross-shard 2PC phases (provision broadcast, reception, execution, vote aggregation, certificate collection), registration with provisions coordinator.
- **livelock**: Cycle detection, deferral, retry, `TransactionDefer`, `TransactionAbort`, integration with block proposal and execution.
- **types**: `StateProvision`, `StateCertificate`, `CommitmentProof`, `CycleProof`, defer/abort types.
- **core**: `BroadcastStateProvision`, `BroadcastStateCertificate`, `VerifyAndAggregateProvisions`, `VerifyCycleProof`, etc.

### Quiz: Group 6 (Cross-shard and livelock)

1. State provisions are sent from “source shard” (owners of read state) to “target shard” (executor). Who decides which validators on the source shard send provisions—every validator, or only a subset? Where is that logic?
2. The target shard needs 2f+1 *matching* provisions from each source shard. What must “match” (same tx_hash, same entries, same block_height?), and what happens if 2f+1 provisions have different `entries` for the same (tx_hash, source_shard)?
3. `VerifyAndAggregateProvisions` is deferred until enough provisions are buffered (quorum threshold). Why not verify each provision as it arrives, and what efficiency or correctness issue does deferred verification avoid?
4. A cross-shard tx can be “deferred” due to livelock (cycle). When the proposer includes a `TransactionDefer` in a block, what must the block also include (e.g. proof) so that other validators accept the deferral?
5. After a tx is deferred, a “retry” transaction is created with the same payload but different hash. Where is the retry created (which crate), and how does the mempool treat the original tx vs the retry for status and eviction?
6. Livelock detects cycles across shards (e.g. tx A waits on B, B waits on A). How does the protocol pick a “winner” and “loser” in a cycle, and where is that ordering defined (hash-based, or something else)?
7. `CommitmentProof` is the aggregated result of 2f+1 provisions from a source shard. Where is the `CommitmentProof` first created (which action’s result), and who includes it in a block (proposer for which shard)?
8. If a cross-shard tx has three participating shards (two source, one target), how many distinct `StateProvision` flows are there (source→target pairs), and how many `StateCertificate`s must be collected before building the `TransactionCertificate`?
9. Execution registers a cross-shard tx with the provision coordinator when the block commits. Can provisions for that tx arrive *before* the block commits (e.g. from an optimistic or mistaken sender)? If so, how does the coordinator handle early arrivals?
10. When a block contains both a deferred tx and the winner tx’s certificate, in what order must the node process them (e.g. deferral first vs certificate first), and why? Where is that order enforced?

---

## Simulation, spammer, test-helpers, and parallel runs

The crates **hyperscale-simulation**, **hyperscale-simulator**, **hyperscale-spammer**, **hyperscale-test-helpers**, and **hyperscale-parallel** are not part of the basic “transaction flow + crate reading” path above. They are covered in **Intermediate** and **Advanced** Hyperscale modules:

- **Intermediate:** Running the simulator (`hyperscale-sim`), how the simulation runner maps actions to events, and using the spammer against a local cluster to see the flow end-to-end.
- **Advanced:** Deterministic vs parallel simulation, stress testing, and using test-helpers to build fixtures and write tests (bft, execution, provisions).

When those docs exist, they will link here. For now, treat Basic as: flow (top) → crate groupings + quizzes → hands-on next steps.
