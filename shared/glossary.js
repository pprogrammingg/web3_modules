// Glossary: technical def, explain to 10yo, subcategory, competing concepts.
// Keys are lowercase lookup IDs; multiple keys can point to same entry (e.g. qc → quorum certificate).
// Subcategories (order used on glossary page): Distributed Systems Fundamentals, Consensus & Agreement,
// Fault Models & Security, Networking & Propagation, Time Ordering & Race Conditions, Cryptography & Hashing,
// Blockchain & Ledgers, State & Execution, Scalability & Sharding, Economics & Incentives, Web3 & Applications

const GLOSSARY_ENTRIES = [
  // ---- Distributed Systems Fundamentals ----
  {
    key: 'consensus',
    keys: ['consensus'],
    term: 'Consensus',
    def: 'Agreement among distributed nodes on a single value or ordering of values despite failures and delays.',
    technicalDef: 'A distributed consensus protocol ensures that all correct (non-faulty) nodes agree on the same value or sequence of values, even when some nodes fail, lag, or act maliciously. This is the core problem of replicated state machines.',
    explain10yo: 'Imagine a group of friends deciding where to eat with no single boss: they have to all agree on one place even if some friends are slow to answer or try to trick the others.',
    subCategory: ['Distributed Systems Fundamentals', 'Consensus & Agreement'],
    competingConcepts: 'Consensus vs central authority: consensus removes single point of control but adds latency and message complexity. Different algorithms (Paxos, Raft, BFT, Nakamoto) trade off fault model (crash vs Byzantine), latency, and message count.',
  },
  {
    key: 'state machine replication',
    keys: ['state machine replication', 'smr'],
    term: 'State Machine Replication (SMR)',
    def: 'Replicating a deterministic state machine across nodes so all apply the same sequence of inputs and stay in sync.',
    technicalDef: 'SMR keeps multiple copies of the same state machine in sync by having all replicas apply the same totally ordered sequence of commands. Consensus is used to agree on that order; then each replica executes the commands deterministically, so they all reach the same state.',
    explain10yo: 'Like many copies of the same board game: everyone must agree on the exact order of moves, then each copy applies those moves so every board looks the same.',
    subCategory: ['Distributed Systems Fundamentals', 'State & Execution'],
    competingConcepts: 'SMR vs primary-backup: SMR uses consensus for ordering and avoids a single primary; primary-backup is simpler but the primary is a bottleneck and single point of failure. SMR underpins most BFT blockchains.',
  },
  {
    key: 'cap theorem',
    keys: ['cap theorem', 'cap'],
    term: 'CAP Theorem',
    def: 'In a distributed system you cannot have all three at once: Consistency, Availability, and Partition tolerance.',
    technicalDef: 'CAP states that under a network partition (P), a system must choose between maintaining strong consistency (C)—every read sees the latest write—or availability (A)—every request gets a response. In practice partition tolerance is non-negotiable, so the choice is really CP vs AP.',
    explain10yo: 'When two groups can\'t talk to each other (a partition), you have to choose: either keep everyone\'s list the same and sometimes say "I can\'t tell you right now" when they ask (consistency, but not always available), or always answer when asked but let the two groups have different lists until they can talk again (available, but not consistent).',
    subCategory: ['Distributed Systems Fundamentals'],
    competingConcepts: 'CP (e.g. many blockchains, ZooKeeper) favors correctness over availability during partitions; AP (e.g. Dynamo, Cassandra) favors availability and eventual consistency. BASE (Basically Available, Soft state, Eventual consistency) is the AP-oriented design pattern.',
  },
  {
    key: 'flp impossibility',
    keys: ['flp impossibility', 'flp'],
    term: 'FLP Impossibility',
    def: 'In an asynchronous network, no deterministic consensus protocol can guarantee termination if even one node can crash.',
    technicalDef: 'Fischer, Lynch, and Paterson proved that in an asynchronous system (no bounds on message delay), no deterministic protocol can achieve consensus (agreement, validity, termination) in the presence of one crash fault. So either we use randomness, assume partial synchrony, or sacrifice guaranteed termination.',
    explain10yo: 'If you can never be sure whether a friend is just slow or dropped out, the group might never be able to finally decide—unless you allow coin flips or assume "they\'ll answer within a minute."',
    subCategory: ['Distributed Systems Fundamentals', 'Consensus & Agreement'],
    competingConcepts: 'FLP forces protocol designers to add assumptions: partial synchrony (eventual bounds), failure detectors, or randomness (e.g. Ben-Or, Algorand). Practical BFT protocols assume partial synchrony to get both safety and liveness.',
  },
  {
    key: 'partial synchrony',
    keys: ['partial synchrony'],
    term: 'Partial Synchrony',
    def: 'Network assumption: after some unknown global stabilization time (GST), messages are delivered within a known bound.',
    technicalDef: 'Partial synchrony means the system is asynchronous until some unknown point (GST), after which message delays are bounded by a known Δ. This assumption allows protocols to guarantee both safety and liveness: they wait long enough after GST to make progress.',
    explain10yo: 'We don\'t know when, but eventually the mail will start arriving within a week. Before that, we just wait; after that, we can make decisions because we know how long to wait.',
    subCategory: ['Distributed Systems Fundamentals', 'Networking & Propagation'],
    competingConcepts: 'Partial synchrony vs full synchrony (clocks and delays known) vs asynchrony (no timing guarantees). Most BFT blockchains assume partial synchrony; Nakamoto consensus avoids timing assumptions but gives probabilistic finality and uses energy (PoW).',
  },
  {
    key: 'gst',
    keys: ['gst', 'global stabilization time'],
    term: 'GST (Global Stabilization Time)',
    def: 'The unknown time after which the network obeys bounded message delays in the partial synchrony model.',
    technicalDef: 'In partial synchrony, GST is the time instant after which all message delays are bounded by a known Δ. The protocol does not know when GST occurs—only that it eventually does. This assumption allows BFT protocols to guarantee liveness (progress) after GST while preserving safety (no conflicting commits) at all times.',
    explain10yo: 'The moment when the mail finally starts arriving on time. We don\'t know which day that is, but we know it will happen, and after that we can finish the game.',
    subCategory: ['Distributed Systems Fundamentals', 'Networking & Propagation'],
    competingConcepts: 'GST is part of the partial synchrony model; without it (full asynchrony), FLP says consensus cannot guarantee termination. With GST, protocols can use timeouts for view changes and progress.',
  },

  // ---- Consensus & Agreement ----
  {
    key: 'finality',
    keys: ['finality'],
    term: 'Finality',
    def: 'The guarantee that once a block is committed, it cannot be reverted or changed.',
    technicalDef: 'In BFT systems, finality is deterministic and immediate once a block gets a quorum certificate (QC) and the next block also gets a QC (two-chain rule). No further blocks can undo it. In Nakamoto consensus, finality is probabilistic (more confirmations = higher confidence).',
    explain10yo: 'When the teacher writes your grade in the book and the next page is already written, that grade is final—nobody can erase it without everyone noticing.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'Deterministic finality (BFT, 2-chain) vs probabilistic finality (Bitcoin, more blocks = more security). Fast finality improves UX and reduces reorg risk; probabilistic finality avoids strict timing assumptions and is simpler in open P2P networks.',
  },
  {
    key: 'quorum certificate',
    keys: ['quorum certificate', 'qc'],
    term: 'Quorum Certificate (QC)',
    def: 'Cryptographic proof that at least 2f+1 validators have voted for a block.',
    technicalDef: 'A QC is an aggregated signature (or similar proof) from a quorum of validators attesting that they voted for a specific block. In a system with n = 3f+1 nodes, any set of 2f+1 signatures proves that a majority has agreed, and any two quorums overlap in at least one honest node, ensuring agreement.',
    explain10yo: 'A signed note from more than half the class saying "we all agree this is the answer." One honest person can\'t sign two different answers, so you can\'t have two different real notes.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'QC-based BFT (HotStuff, PBFT) vs signature aggregation in DPoS (e.g. Tendermint). QCs enable one-round proof of agreement; alternative is multi-round voting without aggregation (higher message size).',
  },
  {
    key: 'quorum',
    keys: ['quorum'],
    term: 'Quorum',
    def: 'A set of at least 2f+1 validators in a BFT system with 3f+1 total; any two quorums overlap in at least one honest node.',
    technicalDef: 'In a system tolerating f Byzantine faults with n = 3f+1 nodes, a quorum is any set of at least 2f+1 nodes. The quorum intersection property: any two quorums share at least one correct node, so they cannot commit conflicting values.',
    explain10yo: 'Enough people that you need at least one honest person in every group that size. So two different "majority" votes would have to share one honest person—who wouldn\'t vote for both.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'Quorum size 2f+1 (BFT) vs majority in crash fault (f+1). Larger quorums (e.g. 3f+1) give more redundancy but reduce availability; 2f+1 is the minimum for Byzantine agreement.',
  },
  {
    key: 'bft',
    keys: ['bft', 'byzantine fault tolerance'],
    term: 'Byzantine Fault Tolerance (BFT)',
    def: 'A consensus approach: how nodes agree on the next block. A fixed or known set of validators vote; once a quorum agrees (e.g. 2f+1 of 3f+1), the block is committed. The system remains correct even when up to f nodes are Byzantine (malicious or faulty).',
    technicalDef: 'In a BFT system with n = 3f+1 nodes, up to f nodes can be arbitrary (Byzantine): they may crash, delay, or send conflicting messages. Agreement is by voting and quorum certificates (QCs). The protocol guarantees safety (all correct nodes agree) and liveness (progress) as long as at most f nodes are faulty. BFT answers "how do we agree?"—not "who gets to propose?" (that can be fixed set, PoS, etc.).',
    explain10yo: 'The game still works even if some players try to cheat or give wrong answers, as long as most players are honest and follow the rules. Everyone votes on the next move; when enough agree, that move is final.',
    subCategory: ['Consensus & Agreement', 'Fault Models & Security'],
    competingConcepts: 'BFT vs PoW: BFT is the agreement rule (voting); PoW is who gets to propose (miners) and is used with longest-chain consensus, not BFT. BFT vs CFT: BFT handles malicious nodes but needs 3f+1; CFT (e.g. Raft) needs 2f+1. BFT can be combined with PoS (e.g. Tendermint: BFT consensus + PoS for validator selection).',
  },
  {
    key: 'pbft',
    keys: ['pbft'],
    term: 'PBFT (Practical Byzantine Fault Tolerance)',
    def: 'Classic BFT consensus with three-phase commit, three-chain commit rule, and coordinated view changes; O(n²) messages.',
    technicalDef: 'PBFT uses pre-prepare, prepare, and commit phases; a block commits only after three consecutive blocks have quorum certificates (three-chain rule). View changes to replace a suspected faulty leader require explicit coordinated voting, which adds complexity and latency.',
    explain10yo: 'A strict rulebook: everyone has to say "I got the plan," then "I agree," then "I commit," and you need three steps in a row. Changing the leader needs a full vote.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'PBFT vs HotStuff: HotStuff uses two-chain commit and implicit view change with O(n) message complexity; PBFT is O(n²). PBFT vs Tendermint: Tendermint is round-based with locked blocks; PBFT uses a pipeline of phases.',
  },
  {
    key: 'hotstuff',
    keys: ['hotstuff', 'hotstuff-2'],
    term: 'HotStuff',
    def: 'BFT consensus with two-chain commit, implicit view change, and linear O(n) message complexity.',
    technicalDef: 'HotStuff (and HotStuff-2) uses a single phase of voting per block and a two-chain commit rule: a block commits when it and the next block both have QCs. View changes are implicit: on timeout, the next leader proposes; if it gets a QC, the view change is accepted without explicit view-change votes.',
    explain10yo: 'Same goal as the strict rulebook but fewer steps: two OKs in a row are enough, and if the leader is slow, the next leader just takes over without a big vote.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'HotStuff vs PBFT: lower latency (2 blocks vs 3), O(n) vs O(n²), simpler view change. HotStuff vs Tendermint: similar round structure; HotStuff pipelines blocks for better throughput.',
  },
  {
    key: 'view',
    keys: ['view', 'view number', 'round'],
    term: 'View / Round (BFT)',
    def: 'In leader-based BFT, a view (or round) is a period in which one leader is designated to propose a block.',
    technicalDef: 'The view number (or round number) is a monotonically increasing identifier. Each view has exactly one proposer/leader, chosen deterministically from the validator set (e.g. view mod n). All nodes in the shard agree on the view number and thus on who the current proposer is. On timeout or failure to get a QC, the protocol advances to the next view (view change).',
    explain10yo: 'Like a turn number in a game: "This is turn 5, so it\'s Alice\'s turn to propose." Everyone agrees on the number, so everyone agrees whose turn it is.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'View (BFT) vs block height: height is the block index in the chain; view can advance without producing a block (e.g. on timeout).',
  },
  {
    key: 'view change',
    keys: ['view change'],
    term: 'View Change',
    def: 'Process of changing the leader/proposer when the current leader is suspected of being faulty.',
    technicalDef: 'In leader-based BFT, each "view" has one leader. If the leader is slow or malicious, nodes must switch to a new view and a new leader. In PBFT this requires coordinated view-change voting; in HotStuff-2 it is implicit (timeout → next leader proposes).',
    explain10yo: 'When the person in charge isn\'t doing their job, the group has to agree to let someone else be in charge. Some games do that with a big vote; others just let the next person try.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'Coordinated view change (PBFT) vs implicit (HotStuff). Coordinated gives explicit agreement on the new leader but adds rounds and complexity; implicit is faster but relies on timeouts and next-in-line leader.',
  },
  {
    key: 'coordinated view-change',
    keys: ['coordinated view-change'],
    term: 'Coordinated View-Change',
    def: 'In PBFT, when nodes suspect the leader is faulty, they coordinate a view-change through explicit voting.',
    technicalDef: 'Nodes send view-change messages, gather a quorum of view-change messages for the new view, then the new leader sends a new-view message with the prepared state. All nodes must agree on the new leader and the state to continue from.',
    explain10yo: 'Everyone has to raise their hand and say "we want a new leader," then the new leader has to show everyone where we left off so we all continue from the same place.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'See view change: coordinated (PBFT) vs implicit (HotStuff).',
  },
  {
    key: 'implicit view change',
    keys: ['implicit view change'],
    term: 'Implicit View Change',
    def: 'In HotStuff-2, if a block doesn\'t get a QC in time, nodes advance to the next view/leader without explicit voting.',
    technicalDef: 'On timeout, nodes move to the next view; the next leader (e.g. round-robin) proposes a block. If that block gets a QC, the view change is implicitly accepted and the chain progresses. No separate view-change phase or votes.',
    explain10yo: 'If the leader doesn\'t get an answer in time, the next person just tries. If they get an answer, we\'re good—no need for a separate "who\'s leader now?" vote.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'See view change.',
  },
  {
    key: 'two-chain commit',
    keys: ['two-chain commit'],
    term: 'Two-Chain Commit',
    def: 'A block commits when both it and the next block have QCs; reduces commit latency vs three-chain.',
    technicalDef: 'Block at height H commits once H has a QC and the block at H+1 also has a QC. The chain of two QCs proves that a quorum has agreed on H and then on H+1, so H is safe. Used in HotStuff and similar protocols.',
    explain10yo: 'You need two "stamps" in a row: one on your page and one on the next. Then your page is officially done.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'Two-chain (HotStuff) vs three-chain (PBFT): two-chain gives lower latency; three-chain was used in PBFT for a stronger safety argument under early design.',
  },
  {
    key: 'three-chain commit',
    keys: ['three-chain commit'],
    term: 'Three-Chain Commit',
    def: 'In PBFT, a block commits only after three consecutive blocks have QCs.',
    technicalDef: 'Blocks at heights H, H+1, and H+2 must all have quorum certificates before the block at H is committed. This adds one more round of confirmation than the two-chain rule and increases commit latency.',
    explain10yo: 'Three stamps in a row are needed before the first page is considered final—stricter but slower.',
    subCategory: ['Consensus & Agreement'],
    competingConcepts: 'See two-chain commit.',
  },
  {
    key: 'nakamoto consensus',
    keys: ['nakamoto consensus', 'nakamoto'],
    term: 'Nakamoto Consensus',
    def: 'Consensus via longest-chain rule and proof-of-work; probabilistic finality, no strict identity or synchrony.',
    technicalDef: 'Nodes extend the longest valid chain by solving a proof-of-work puzzle. Agreement is emergent: the chain with the most cumulative work is considered canonical. Finality is probabilistic (more confirmations = lower reorg probability). No explicit voting or fixed validator set.',
    explain10yo: 'Everyone tries to add the next page to the story. The version that has the most "work" (hard puzzles solved) wins. The more pages built on top of yours, the safer your page is.',
    subCategory: ['Consensus & Agreement', 'Blockchain & Ledgers'],
    competingConcepts: 'Nakamoto vs BFT: Nakamoto is open (anyone can mine), permissionless, and uses probabilistic finality; BFT is typically permissioned with a known set and deterministic finality. Trade-off: openness and simplicity vs fast finality and identity assumptions.',
  },
  {
    key: 'proof of work',
    keys: ['proof of work', 'pow'],
    term: 'Proof of Work (PoW)',
    def: 'A mechanism for who gets to propose the next block: nodes (miners) compete to solve a costly puzzle; the solution grants the right to propose. PoW is used with longest-chain (Nakamoto) consensus, not BFT—so agreement is probabilistic, not voting-based.',
    technicalDef: 'Miners repeatedly hash block candidates with a nonce until the hash meets a target (e.g. leading zeros). Finding such a nonce is hard; verifying is easy. The solver proposes the next block and is rewarded. The chain uses the longest-chain rule for agreement; there is no BFT-style voting or quorum. Security comes from the cost of amassing majority hashrate.',
    explain10yo: 'A race where you have to solve a hard math puzzle. The first to solve it gets to write the next page. It\'s hard to do but easy for everyone to check. The "real" story is the longest one that everyone built on.',
    subCategory: ['Consensus & Agreement', 'Economics & Incentives'],
    competingConcepts: 'PoW vs BFT: PoW answers "who proposes?" and uses longest chain; BFT answers "how do we agree?" with voting and quorums. PoW does not use BFT. PoW vs PoS: PoW uses energy and hardware; PoS uses staked capital. Both can be combined with different agreement rules (e.g. PoS + BFT in Tendermint).',
  },
  {
    key: 'proof of stake',
    keys: ['proof of stake', 'pos'],
    term: 'Proof of Stake (PoS)',
    def: 'Consensus where validators are chosen or weighted by staked capital; misbehavior can be slashed.',
    technicalDef: 'Validators lock (stake) tokens. Selection or voting power is based on stake. Proposing or attesting incorrectly can lead to slashing (loss of stake). This replaces energy expenditure with economic commitment and enables faster finality and lower energy use.',
    explain10yo: 'You put some tokens in the game to be a referee. If you cheat, you lose your tokens. The more you put in, the more say you have—but you have something to lose.',
    subCategory: ['Consensus & Agreement', 'Economics & Incentives'],
    competingConcepts: 'PoS vs PoW: see proof of work. PoS variants: chain-based (longest chain by stake), BFT-style (voting rounds), and hybrid (e.g. Ethereum\'s LMD-GHOST + Casper FFG).',
  },

  // ---- Fault Models & Security ----
  {
    key: 'byzantine fault',
    keys: ['byzantine fault', 'byzantine'],
    term: 'Byzantine Fault',
    def: 'A node that can behave arbitrarily: crash, delay, or send conflicting messages to different peers.',
    technicalDef: 'In the Byzantine fault model, faulty nodes are not limited to crashing—they can deviate arbitrarily from the protocol, lie, or coordinate with other faulty nodes. Protocols must guarantee safety and liveness despite up to f such nodes (typically n ≥ 3f+1).',
    explain10yo: 'A player who might not just quit but might lie or tell different friends different things to mess up the game.',
    subCategory: ['Fault Models & Security', 'Consensus & Agreement'],
    competingConcepts: 'Byzantine vs crash fault: crash = node stops; Byzantine = node can do anything. Handling Byzantine faults requires more nodes (3f+1) and more complex protocols than crash fault tolerance (2f+1).',
  },
  {
    key: 'crash fault',
    keys: ['crash fault'],
    term: 'Crash Fault',
    def: 'A node that stops responding (fails silently); it does not send incorrect or conflicting messages.',
    technicalDef: 'In the crash fault model, faulty nodes simply stop participating—they do not deviate from the protocol before stopping. This allows simpler and more efficient consensus (e.g. Paxos, Raft) with n ≥ 2f+1.',
    explain10yo: 'A player who drops out and stops answering—they don\'t lie, they just go quiet.',
    subCategory: ['Fault Models & Security'],
    competingConcepts: 'Crash vs Byzantine: see Byzantine fault. Many production systems (databases, queues) assume crash faults; blockchains and adversarial environments assume Byzantine.',
  },
  {
    key: 'sybil attack',
    keys: ['sybil attack', 'sybil'],
    term: 'Sybil Attack',
    def: 'An attacker creates many fake identities to gain disproportionate influence in voting or reputation.',
    technicalDef: 'A single entity controls many pseudonymous identities (Sybils) to appear as multiple participants. In open P2P systems this can threaten consensus, reputation, or fairness. Defenses include proof-of-work, proof-of-stake (costly identity), or trusted identity/registration.',
    explain10yo: 'One person pretending to be lots of people so their vote counts more. Like one kid using many fake names to win a class poll.',
    subCategory: ['Fault Models & Security'],
    competingConcepts: 'Sybil resistance via PoW (cost per identity), PoS (stake per identity), or permissioned sets. Permissionless systems must make identity costly; permissioned systems use admission control.',
  },
  {
    key: '51 percent attack',
    keys: ['51 percent attack', '51% attack', 'majority attack'],
    term: '51% Attack',
    def: 'When an attacker controls more than half of mining or stake and can reorg the chain or double-spend.',
    technicalDef: 'In PoW (or similar) consensus, controlling a majority of hashrate (or in PoS, stake) allows the attacker to produce a longer chain and force a reorg, censor transactions, or double-spend. Defense is economic: acquiring majority is prohibitively expensive.',
    explain10yo: 'If one person could do more than half of all the puzzle-solving, they could rewrite the story and make their version the "longest" one—so the system trusts that being that strong is too expensive.',
    subCategory: ['Fault Models & Security', 'Economics & Incentives'],
    competingConcepts: '51% is inherent to longest-chain consensus. Mitigations: higher hashrate/stake distribution, checkpoints, or switching to BFT-style finality (where 2/3 is required and reorgs are not allowed after finality).',
  },

  // ---- Networking & Propagation ----
  {
    key: 'gossip protocol',
    keys: ['gossip protocol', 'gossip'],
    term: 'Gossip Protocol',
    def: 'Each node repeatedly forwards information to a random subset of peers; information spreads epidemically across the network.',
    technicalDef: 'In gossip (epidemic) dissemination, each node periodically selects one or more peers and sends them the latest data it has. New data spreads in a rumor-like fashion. With high probability all nodes eventually receive the data. No central broadcaster; robust to churn and failure.',
    explain10yo: 'Like a rumor: you tell a few friends, they tell a few friends, and pretty soon everyone has heard it—without one person having to tell everyone.',
    subCategory: ['Networking & Propagation'],
    competingConcepts: 'Gossip vs broadcast tree: gossip is robust and simple but redundant (many copies of same message). Flooding is a simple form of gossip. Structured overlays (e.g. DHT) can reduce redundancy but add complexity and dependency on structure.',
  },
  {
    key: 'p2p',
    keys: ['p2p', 'peer-to-peer'],
    term: 'Peer-to-Peer (P2P)',
    def: 'Network where nodes communicate directly with each other without a central server.',
    technicalDef: 'In a P2P overlay, participants are equal peers; there is no single coordinator or server. Peers discover each other (e.g. via bootstrap nodes, DHT, or gossip), connect, and exchange data. Blockchains use P2P for block and transaction propagation.',
    explain10yo: 'Everyone is both a listener and a messenger—no single "main" computer that everyone talks to.',
    subCategory: ['Networking & Propagation'],
    competingConcepts: 'P2P vs client-server: P2P improves resilience and avoids central censorship; client-server is simpler to deploy and manage. Hybrid designs use P2P for consensus and optional centralized services (indexing, gateways).',
  },
  {
    key: 'dht',
    keys: ['dht', 'distributed hash table'],
    term: 'Distributed Hash Table (DHT)',
    def: 'A distributed key-value store where keys are mapped to nodes; used for discovery and content routing.',
    technicalDef: 'A DHT partitions the key space across nodes so that given a key, the network can route to the node(s) responsible for that key in O(log n) hops. Used for peer discovery (e.g. Kademlia in Ethereum), content addressing, and decentralized storage indexing.',
    explain10yo: 'A shared address book that\'s split among everyone: to find "Alice," you ask someone who points you to someone else, and in a few steps you find who has Alice\'s info.',
    subCategory: ['Networking & Propagation'],
    competingConcepts: 'DHT vs centralized registry: DHT is decentralized and censorship-resistant but has churn and eventual consistency. DHT vs gossip: DHT gives targeted lookup; gossip gives broad dissemination.',
  },
  {
    key: 'broadcast',
    keys: ['broadcast'],
    term: 'Broadcast',
    def: 'Sending a message to all nodes in the network (or all in a group).',
    technicalDef: 'Broadcast ensures every correct node eventually delivers the same message. Reliable broadcast also guarantees agreement (all deliver the same set) and validity (if sender is correct, all deliver). Implemented via flooding, gossip, or tree-based dissemination.',
    explain10yo: 'Making sure every person in the group gets the same announcement—whether by shouting, passing notes, or telling a few people who tell everyone else.',
    subCategory: ['Networking & Propagation'],
    competingConcepts: 'Best-effort broadcast (e.g. UDP flood) vs reliable broadcast (agreement + delivery). Byzantine broadcast (e.g. Bracha) adds correctness even when the sender or some nodes are malicious.',
  },

  // ---- Time, Ordering & Race Conditions ----
  {
    key: 'toctou',
    keys: ['toctou', 'tictouco', 'time-of-check to time-of-use'],
    term: 'TOCTOU / TICTOUCO (Time-of-Check to Time-of-Use)',
    def: 'A race condition where the state can change between when you check it and when you use it.',
    technicalDef: 'TOCTOU (Time-of-Check to Time-of-Use) is a class of race conditions: a program checks a condition (e.g. "balance >= 10") and later uses it (e.g. "deduct 10"). Between check and use, another transaction can modify state, leading to double-spend or inconsistent behavior. Fixes include atomic operations, locks, or serializable execution.',
    explain10yo: 'You look in the cookie jar, see one cookie, and go to get it—but your sibling grabs it first. When you reach, it\'s gone. The "check" (looking) and "use" (taking) weren\'t one atomic step.',
    subCategory: ['Time Ordering & Race Conditions', 'State & Execution'],
    competingConcepts: 'TOCTOU in blockchains: concurrent transactions can create races (e.g. two transfers from same account). Mitigations: sequential execution per account (Ethereum), UTXO spending rules (Bitcoin), or explicit locking/serialization in smart contracts.',
  },
  {
    key: 'logical clock',
    keys: ['logical clock', 'lamport clock'],
    term: 'Logical Clock',
    def: 'A counter that orders events without physical time; incremented on events and when sending messages.',
    technicalDef: 'Logical clocks (e.g. Lamport timestamps) assign a monotonically increasing value to events so that if event A happened before B, clock(A) < clock(B). No need for synchronized wall clocks. Used for ordering and causality in distributed systems.',
    explain10yo: 'Instead of "what time did it happen?" we use "what number did we give it?"—so we can tell which thing happened before which, without everyone having the same watch.',
    subCategory: ['Time Ordering & Race Conditions', 'Distributed Systems Fundamentals'],
    competingConcepts: 'Logical clock vs physical timestamp: logical avoids clock skew but doesn\'t measure real time. Vector clocks extend logical clocks to capture concurrent events. Blockchains often use block height + position as a total order instead of timestamps.',
  },

  // ---- Cryptography & Hashing ----
  {
    key: 'merkle root',
    keys: ['merkle root', 'merkle tree'],
    term: 'Merkle Root / Merkle Tree',
    def: 'A hash of all transactions in a block (or data set), organized in a tree for efficient proofs.',
    technicalDef: 'A Merkle tree hashes pairs of items (or hashes) recursively until a single root hash remains. The root commits to the entire set. A Merkle proof for one leaf is a path of sibling hashes from leaf to root; verifiers can check inclusion without storing the full set.',
    explain10yo: 'A single fingerprint for a whole list. You can prove "this item was in the list" by showing a short path of hashes from the item to the top fingerprint—without showing the whole list.',
    subCategory: ['Cryptography & Hashing', 'Blockchain & Ledgers'],
    competingConcepts: 'Merkle tree vs flat hash list: tree gives O(log n) proof size; flat list gives O(n). Patricia tries (e.g. Ethereum) extend Merkle structure for key-value state. Verkle trees reduce proof size further with vector commitments.',
  },
  {
    key: 'cryptographic hash',
    keys: ['cryptographic hash', 'hash'],
    term: 'Cryptographic Hash',
    def: 'A one-way function that maps data to a fixed-size fingerprint; small change changes the output completely.',
    technicalDef: 'A cryptographic hash function (e.g. SHA-256, Keccak) takes arbitrary input and produces a fixed-size digest. Properties: deterministic, preimage-resistant (hard to find input from output), collision-resistant (hard to find two inputs with same hash), and avalanche (small input change → large output change).',
    explain10yo: 'A magic blender: you put in anything, you get a short code. Change one letter and the code is totally different. You can\'t get the original back from the code.',
    subCategory: ['Cryptography & Hashing'],
    competingConcepts: 'Cryptographic hash vs non-cryptographic (e.g. CRC): crypto hashes are designed to resist attacks. SHA-256 vs Keccak: both widely used in blockchains; Keccak is used in Ethereum.',
  },
  {
    key: 'digital signature',
    keys: ['digital signature'],
    term: 'Digital Signature',
    def: 'A cryptographic proof that a message was created by the holder of a private key and was not altered.',
    technicalDef: 'Signing uses a private key to produce a signature; anyone with the public key can verify that the signature matches the message and was produced by the key holder. Provides authenticity and integrity. Used for transactions, blocks, and attestations in blockchains.',
    explain10yo: 'A seal that only you can make with your secret stamp. Anyone can check that the seal is real and that the message wasn\'t changed—but they can\'t make the seal themselves.',
    subCategory: ['Cryptography & Hashing'],
    competingConcepts: 'ECDSA vs EdDSA vs BLS: ECDSA is widely used (Bitcoin, Ethereum); EdDSA is faster and simpler; BLS allows signature aggregation (one signature for many signers), used in many PoS and BFT designs.',
  },
  {
    key: 'commitment scheme',
    keys: ['commitment scheme', 'commitment'],
    term: 'Commitment Scheme',
    def: 'A binding and hiding way to commit to a value and reveal it later; verifiers can check it was not changed.',
    technicalDef: 'Commit: sender publishes a commitment (e.g. hash of value + randomness). Later they reveal the value and randomness. Verifiers check that the commitment matches. Hiding: commitment doesn\'t leak the value. Binding: sender cannot reveal a different value. Used in ZK proofs, auctions, and protocols.',
    explain10yo: 'You put your guess in a locked box and show everyone the box. Later you open it. No one can see your guess until then, and you can\'t swap your guess after seeing theirs.',
    subCategory: ['Cryptography & Hashing'],
    competingConcepts: 'Hash commitment vs Pedersen commitment: hash is binding and hiding under CR; Pedersen is information-theoretically hiding. Vector commitments (e.g. KZG) allow proving membership in a set with constant-size proofs.',
  },

  // ---- Blockchain & Ledgers ----
  {
    key: 'blockchain',
    keys: ['blockchain'],
    term: 'Blockchain',
    def: 'A distributed ledger of blocks linked by hashes; each block contains transactions and a reference to the previous block.',
    technicalDef: 'A blockchain is an append-only, hash-linked chain of blocks. Each block has a header (previous block hash, Merkle root of transactions, nonce, etc.) and a body (transactions or state updates). Consensus determines which chain is canonical; integrity is enforced by verifying hashes and rules.',
    explain10yo: 'A shared notebook where each page has a stamp that depends on the page before it. If you change an old page, the stamp breaks and everyone knows.',
    subCategory: ['Blockchain & Ledgers'],
    competingConcepts: 'Blockchain vs DAG (directed acyclic graph): blockchain is a linear chain; DAG allows multiple branches and can increase throughput (e.g. IOTA, Nano) but complicates consensus and finality. Blockchain vs centralized ledger: decentralization and censorship resistance vs performance and control.',
  },
  {
    key: 'block',
    keys: ['block'],
    term: 'Block',
    def: 'A batch of transactions (or state updates) with a header linking it to the previous block and committing to the contents.',
    technicalDef: 'A block typically includes a header (parent hash, Merkle root, timestamp, nonce, difficulty, etc.) and a list of transactions. The header is hashed to form the block hash; the parent hash links to the previous block. Miners/validators propose blocks; consensus decides which blocks are included in the canonical chain.',
    explain10yo: 'One page of the notebook: a list of "who paid whom" (or other actions) plus a link to the previous page so the order is fixed.',
    subCategory: ['Blockchain & Ledgers'],
    competingConcepts: 'Block size vs block frequency: larger or more frequent blocks increase throughput but propagation and validation cost grow. Many protocols tune block size and interval (e.g. 12s blocks in Ethereum).',
  },
  {
    key: 'decentralization',
    keys: ['decentralization'],
    term: 'Decentralization',
    def: 'Distribution of control and data across many participants so there is no single point of failure or control.',
    technicalDef: 'In a decentralized system, no single entity can unilaterally change rules, censor data, or shut down the system. Achieved by replicating data and consensus across many independent nodes. Degrees of decentralization vary (e.g. number and diversity of validators, clients, developers).',
    explain10yo: 'No one person is the boss. Lots of people have a copy of the rules and the list, so even if one person leaves or tries to change things, the rest keep going.',
    subCategory: ['Blockchain & Ledgers'],
    competingConcepts: 'Decentralization vs scalability: more participants often mean more messages and slower agreement. Decentralization vs UX: self-custody and permissionless access can be harder to use than centralized services.',
  },
  {
    key: 'immutability',
    keys: ['immutability'],
    term: 'Immutability',
    def: 'Once data is recorded on the ledger, it is practically impossible to change without detection.',
    technicalDef: 'Immutability comes from cryptographic linking (changing one block invalidates all subsequent hashes) and replication (many nodes hold the same history; altering one copy is detectable). "Practical" because a majority could theoretically reorg (see 51% attack) or change rules by consensus.',
    explain10yo: 'What\'s written stays written. You can add new pages but you can\'t erase or change old ones without everyone noticing because the stamps wouldn\'t match.',
    subCategory: ['Blockchain & Ledgers'],
    competingConcepts: 'Immutability vs mutability: traditional databases allow updates and deletes; blockchains favor append-only for audit and consistency. Some systems (e.g. state channels) keep most data off-chain and only commit final state.',
  },
  {
    key: 'utxo',
    keys: ['utxo', 'unspent transaction output'],
    term: 'UTXO (Unspent Transaction Output)',
    def: 'Model where the ledger is a set of unspent outputs; each transaction consumes some outputs and creates new ones.',
    technicalDef: 'In the UTXO model, the state is a set of outputs, each with an amount and a lock (e.g. public key or script). A transaction references previous outputs as inputs and creates new outputs. Double-spend is prevented because each output can be spent only once. Bitcoin uses UTXO.',
    explain10yo: 'Like coins: each coin can only be spent once. When you pay, you hand over some coins (they\'re "used") and get change as new coins. The ledger is the pile of coins that haven\'t been used yet.',
    subCategory: ['Blockchain & Ledgers', 'State & Execution'],
    competingConcepts: 'UTXO vs account model: UTXO has no global account balance; parallelism is natural (different outputs = different coins). Account model (e.g. Ethereum) has balances per address; simpler for UX but requires careful handling of concurrent updates (TOCTOU, nonces).',
  },
  {
    key: 'account model',
    keys: ['account model', 'account balance'],
    term: 'Account Model',
    def: 'Ledger state is a set of accounts (addresses) with balances and optional storage; transactions modify accounts.',
    technicalDef: 'Each address has a balance and optionally contract storage and code. Transactions specify sender, recipient, value, and data; the sender\'s balance is debited and the recipient\'s (or contract\'s) is credited. Ordering and nonces prevent replay and help with ordering. Ethereum uses the account model.',
    explain10yo: 'Like bank accounts: each person has a balance. When you pay, your balance goes down and theirs goes up. Everyone can see the balances (on a public ledger).',
    subCategory: ['Blockchain & Ledgers', 'State & Execution'],
    competingConcepts: 'Account model vs UTXO: see UTXO. Account model simplifies UX and smart contracts but serialization and fee market (gas) are more complex.',
  },

  // ---- State & Execution ----
  {
    key: 'state machine',
    keys: ['state machine'],
    term: 'State Machine',
    def: 'A model where the system is in one state at a time; events cause deterministic transitions to a new state and optional actions.',
    technicalDef: 'A state machine has a set of states and a transition function: (state, event) → (new state, actions). Given the same state and event, the result is always the same (deterministic). Replicated state machines use consensus to agree on the sequence of events so all replicas stay in sync.',
    explain10yo: 'A board game: the board is in one configuration; when someone makes a move (event), the board goes to a new configuration. Same move from same board always gives the same result.',
    subCategory: ['State & Execution', 'Distributed Systems Fundamentals'],
    competingConcepts: 'State machine vs workflow/process: state machine is formal and deterministic; workflows may have human steps or external inputs. Blockchains often model execution as a state machine (e.g. EVM) for replay and verification.',
  },
  {
    key: 'deterministic',
    keys: ['deterministic'],
    term: 'Deterministic',
    def: 'Same inputs and state always produce the same output; required for consensus and replay.',
    technicalDef: 'Execution is deterministic if given the same initial state and the same sequence of inputs (transactions), every node produces the same final state and outputs. This is essential for replication: all consensus participants must compute the same result to stay in sync.',
    explain10yo: 'Like a recipe: same ingredients and same steps always give the same cake. So if everyone follows the same recipe with the same list of steps, everyone gets the same result.',
    subCategory: ['State & Execution'],
    competingConcepts: 'Determinism vs randomness: blockchains avoid undefined behavior and platform-dependent randomness in execution so that all nodes agree. Randomness (e.g. for leader election) is either external (oracles) or derived from agreed-on data (e.g. block hash) in a deterministic way.',
  },
  {
    key: 'evm',
    keys: ['evm', 'ethereum virtual machine'],
    term: 'Ethereum Virtual Machine (EVM)',
    def: 'The deterministic virtual machine that executes smart contract bytecode on Ethereum and compatible chains.',
    technicalDef: 'The EVM is a stack-based, quasi-Turing-complete VM. Contract code is compiled to EVM bytecode; every node runs the same code with the same inputs to get the same state transition. Gas limits prevent infinite loops. EVM state includes account balances, storage, and code.',
    explain10yo: 'A single rulebook computer that every node runs. Same program and same inputs always give the same answer, so everyone stays in sync.',
    subCategory: ['State & Execution', 'Web3 & Applications'],
    competingConcepts: 'EVM vs other VMs (Wasm, Move): EVM is widely supported and has a large toolchain; Wasm offers performance and language flexibility; Move is designed for assets and safety. EVM compatibility enables reuse of contracts and tooling across chains.',
  },
  {
    key: 'event-driven',
    keys: ['event-driven', 'event-driven architecture'],
    term: 'Event-Driven Architecture',
    def: 'Design where events flow in, trigger state transitions, and produce actions; no single thread of control.',
    technicalDef: 'Events (messages, requests) arrive and are processed by state machines or handlers; processing may emit new events or actions. Decouples producers from consumers and scales well. In hyperscale-rs style designs, Events flow into state machines, and Actions flow out.',
    explain10yo: 'Instead of one person calling everyone, things happen and whoever cares reacts. Like a bell: when it rings (event), everyone who needs to (handlers) does something.',
    subCategory: ['State & Execution', 'Architecture'],
    competingConcepts: 'Event-driven vs request-response: event-driven is asynchronous and scalable; request-response is simpler for direct calls. Event-driven fits distributed systems and consensus layers where ordering is agreed separately.',
  },
  {
    key: 'mempool',
    keys: ['mempool', 'memory pool'],
    term: 'Mempool',
    def: 'A pool of pending (not-yet-included) transactions kept by a node; the proposer picks from it to build the next block.',
    technicalDef: 'Short for "memory pool": the set of valid, not-yet-confirmed transactions that a node holds in memory. Transactions enter the mempool when received or validated; the consensus leader (proposer) selects from the mempool to form the next block. Why "mempool" and not just "memory"? The name emphasizes both that it is a pool (a collection of pending txs) and that it lives in memory (volatile, not yet on-chain). Plain "memory" would be too generic (RAM, storage, etc.); "mempool" is the standard blockchain term for this structure (from Bitcoin).',
    explain10yo: 'A waiting room for transactions. They sit there until the person building the next block picks them. It\'s called a "memory pool" because they\'re stored in the node\'s memory, and it\'s a pool of many transactions.',
    subCategory: ['State & Execution', 'Blockchain & Ledgers'],
    competingConcepts: 'Mempool vs persistent storage: mempool is typically in-memory and can be evicted (e.g. by fee or expiry); committed state is on-chain. Different chains use different mempool policies (size, replacement, privacy).',
  },

  // ---- Scalability & Sharding ----
  {
    key: 'sharding',
    keys: ['sharding'],
    term: 'Sharding',
    def: 'Splitting the network or state into shards that process transactions in parallel to increase throughput.',
    technicalDef: 'Sharding divides validators and/or state into multiple shards. Each shard runs consensus and execution (or only execution) for a subset of accounts or transactions. Throughput scales with the number of shards. Cross-shard communication requires protocols (e.g. 2PC, rollups) for atomicity and consistency.',
    explain10yo: 'Instead of one line for everyone, we open several checkout lines. Each line handles different people; we need rules for when one purchase involves two lines (cross-shard).',
    subCategory: ['Scalability & Sharding'],
    competingConcepts: 'Sharding vs single chain: sharding increases throughput but adds cross-shard complexity and potential security dilution (smaller committee per shard). Alternative: rollups (execute off main chain, post data or proofs to main chain) for scalability without full sharding.',
  },
  {
    key: 'prepare phase',
    keys: ['prepare phase', 'prepare (2pc)', 'lock', 'reserve'],
    term: 'Prepare phase (2PC)',
    def: 'In 2PC, the phase where each participant locks or reserves resources and votes yes/no; no visible state change until commit.',
    technicalDef: 'The coordinator sends prepare to all participants. Each participant runs its part of the transaction (e.g. reserves or locks the affected state), does not make the update visible to others yet, and replies yes or no. If any votes no, the coordinator sends abort and everyone releases locks. Only if all vote yes does the coordinator send commit, and then participants apply the state change. Lock/reserve ensures resources are held until the decision.',
    explain10yo: 'Everyone puts their hand on their part of the deal and says "I can do it" or "I can\'t." Nobody actually does it until the teacher says "everyone go."',
    subCategory: ['Distributed Systems Fundamentals', 'Scalability & Sharding'],
    competingConcepts: 'Prepare (lock/reserve) vs commit (apply): prepare is reversible; commit is the point of no return. In cross-shard 2PC, prepare runs per shard before the global commit/abort.',
  },
  {
    key: 'two-phase commit',
    keys: ['two-phase commit', '2pc', 'two phase commit'],
    term: 'Two-Phase Commit (2PC)',
    def: 'A protocol to make a multi-party update atomic: prepare phase then commit or abort.',
    technicalDef: 'In 2PC, a coordinator asks all participants to prepare (lock resources, vote yes/no). If all vote yes, the coordinator sends commit; otherwise abort. Participants then commit or roll back. Guarantees atomicity but blocks under coordinator or participant failure until recovery.',
    explain10yo: 'The teacher asks everyone "can you do your part?" If everyone says yes, she says "everyone do it now." If one person says no, she says "nobody do it." So it\'s all or nothing.',
    subCategory: ['Distributed Systems Fundamentals', 'Scalability & Sharding'],
    competingConcepts: '2PC vs 3PC: 2PC can block if coordinator fails; 3PC adds a pre-commit phase to reduce blocking but is more complex. 2PC vs eventual consistency: 2PC gives atomicity across shards; eventual consistency avoids coordination but allows temporary inconsistency.',
  },
  {
    key: 'cross-shard transaction',
    keys: ['cross-shard transaction', 'cross-shard'],
    term: 'Cross-Shard Transaction',
    def: 'A transaction that involves state or parties on more than one shard; requires coordination for atomicity.',
    technicalDef: 'Cross-shard transactions read or write state on multiple shards. Ensuring atomicity (all shards commit or none) typically requires a two-phase commit (2PC) or similar: prepare on all shards, then commit or abort. This adds latency and complexity compared to single-shard transactions.',
    explain10yo: 'A deal that needs two lines to agree: "I\'ll pay from line A and you get it on line B." Both lines have to say OK at the same time, or the whole thing is cancelled.',
    subCategory: ['Scalability & Sharding'],
    competingConcepts: 'Cross-shard vs single-shard: cross-shard needs 2PC or async messaging; single-shard is simpler. Design choice: minimize cross-shard traffic (e.g. by sharding by account) vs balance load across shards.',
  },
  {
    key: 'rollup',
    keys: ['rollup', 'layer 2', 'l2'],
    term: 'Rollup / Layer 2 (L2)',
    def: 'Execution layer that runs transactions off the main chain and posts compressed data or proofs back for security.',
    technicalDef: 'Rollups execute transactions off-chain (on a separate chain or sequencer) and post either batched transaction data (optimistic rollup) or validity proofs (ZK rollup) to the main chain. Security (finality, censorship resistance) derives from the main chain; throughput is higher off-chain.',
    explain10yo: 'A side game that uses the main notebook as the referee: we do lots of moves on the side, then we write a short summary (or a proof) in the main notebook so everyone trusts the result.',
    subCategory: ['Scalability & Sharding', 'Blockchain & Ledgers'],
    competingConcepts: 'Optimistic rollup vs ZK rollup: optimistic assumes validity and uses a challenge period; ZK proves correctness with zero-knowledge proofs (faster finality, more complex crypto). Rollup vs sharding: rollup keeps one main chain and adds execution layers; sharding splits the base layer.',
  },

  // ---- Economics & Incentives ----
  {
    key: 'gas',
    keys: ['gas', 'gas fee'],
    term: 'Gas / Gas Fee',
    def: 'Unit of cost for execution and storage on a chain; users pay gas to have transactions processed.',
    technicalDef: 'Gas measures computational and storage cost of operations. Each opcode or storage write consumes gas; the total gas of a transaction is multiplied by a gas price to get the fee (often in the chain\'s native token). Gas limits prevent infinite loops and align cost with resource use.',
    explain10yo: 'Like paying for each step of a recipe: the more steps and the fancier the ingredients, the more you pay. So people don\'t ask for impossible or huge tasks without paying.',
    subCategory: ['Economics & Incentives', 'State & Execution'],
    competingConcepts: 'Gas vs fixed fee: gas aligns fee with cost and prevents abuse; fixed fee is simpler but can be gamed. EIP-1559-style mechanisms burn base fee and let users add priority fee for inclusion.',
  },
  {
    key: 'mev',
    keys: ['mev', 'maximal extractable value'],
    term: 'MEV (Maximal Extractable Value)',
    def: 'Value that can be extracted by reordering, inserting, or censoring transactions (e.g. front-running, sandwiching).',
    technicalDef: 'Block producers (or searchers) can reorder or include/exclude transactions to capture value—e.g. front-running a large trade, sandwiching a user transaction, or liquidating positions. MEV can harm users (worse execution) and affect consensus incentives. Mitigations: private order flow, fair ordering, encrypted mempools.',
    explain10yo: 'Someone who can see your order and place theirs first (or right after yours) to profit from the price move—like cutting in line when you know what everyone is going to buy.',
    subCategory: ['Economics & Incentives', 'Fault Models & Security'],
    competingConcepts: 'MEV is inherent to permissionless ordering. Redistribution (e.g. to validators) vs mitigation (fair ordering, encryption). Protocol design (e.g. commit-reveal, batch auctions) can reduce extractable MEV.',
  },
  {
    key: 'slashing',
    keys: ['slashing'],
    term: 'Slashing',
    def: 'Penalty where a validator loses staked tokens for provable misbehavior (e.g. double-signing, equivocation).',
    technicalDef: 'In PoS and BFT systems, validators stake tokens. Slashing is an on-chain penalty: if they are proven to have violated the protocol (e.g. signed two conflicting blocks), part or all of their stake is burned or redistributed. This disincentivizes attacks and reinforces security.',
    explain10yo: 'If you\'re caught cheating—like signing two different answers—you lose the tokens you put in. So cheating has a real cost.',
    subCategory: ['Economics & Incentives', 'Fault Models & Security'],
    competingConcepts: 'Slashing vs no slashing: slashing strengthens security but can cause accidental loss (bugs, key compromise). Some systems use softer penalties (e.g. inactivity leak) or optional slashing with clear evidence.',
  },

  // ---- Web3 & Applications ----
  {
    key: 'smart contract',
    keys: ['smart contract'],
    term: 'Smart Contract',
    def: 'Code deployed on a blockchain that runs when triggered by a transaction; state and logic are enforced by the chain.',
    technicalDef: 'A smart contract is program code and storage deployed at an address. When a transaction calls it, the chain executes the code in a deterministic VM (e.g. EVM), updating state. Logic is transparent and immutable; execution is trustless in the sense that the chain enforces the rules.',
    explain10yo: 'A vending machine in the cloud: you put in the right input (transaction), and it automatically does what the code says—no human in the middle to change the deal.',
    subCategory: ['Web3 & Applications', 'State & Execution'],
    competingConcepts: 'Smart contracts vs legal contracts: code is precise and self-executing but not flexible; legal contracts rely on courts. Smart contracts vs backend servers: chain gives transparency and censorship resistance; servers give speed and privacy.',
  },
  {
    key: 'dapp',
    keys: ['dapp', 'decentralized application'],
    term: 'dApp (Decentralized Application)',
    def: 'An application that uses a blockchain (and often smart contracts) for backend logic and state instead of a single company server.',
    technicalDef: 'A dApp typically has a frontend (like a web or mobile app) and uses the blockchain for state, identity, payments, or logic via smart contracts. Users may hold keys (wallets) and sign transactions. Data and rules are verifiable and often permissionless.',
    explain10yo: 'An app where the rules and the data live on the shared notebook, so no one company can turn it off or change the rules without everyone seeing.',
    subCategory: ['Web3 & Applications'],
    competingConcepts: 'dApp vs centralized app: dApp trades control and UX for decentralization and censorship resistance. Hybrid designs use chain for critical state and off-chain for performance or privacy.',
  },

  // ---- Project / Architecture (keep existing) ----
  {
    key: 'nodeid',
    keys: ['nodeid', 'node id', 'radix node id', 'NodeID'],
    term: 'NodeID (Radix)',
    def: 'In Radix, the address of an on-chain entity: a component, resource, package, or account.',
    technicalDef: 'NodeID in Radix refers to addresses of on-chain entities—components, resources, packages, accounts—i.e. nodes in the ledger state graph. Used to determine which shard owns the entity (for cross-shard tx classification). Do not confuse with validator identity (which machine runs consensus).',
    explain10yo: 'Like the address of a box in the warehouse: each component or resource has its own address so we know where it lives and which "line" (shard) handles it.',
    subCategory: ['State & Execution', 'Scalability & Sharding'],
    competingConcepts: 'NodeID (on-chain entity address) vs validator identity (consensus node). In Radix docs, NodeID usually means the former.',
  },
  {
    key: 'hyperscale-rs',
    keys: ['hyperscale-rs'],
    term: 'Hyperscale-rs',
    def: 'A Rust implementation of the Hyperscale BFT consensus protocol for high-throughput, sharded blockchain networks.',
    technicalDef: 'Hyperscale-rs is a pure consensus layer implementing Hyperscale—a BFT consensus system designed for sharded, high-throughput networks. It is not a full blockchain platform; it provides the agreement layer on which execution and state can be built. Uses state machines and event-driven design for deterministic, testable logic.',
    explain10yo: 'A set of rules (written in Rust) that help many computers agree on the order of events in a big, split-up blockchain—like the referee of the game, not the whole game.',
    subCategory: ['Consensus & Agreement', 'Architecture'],
    competingConcepts: 'Hyperscale-rs vs full nodes: it focuses on consensus only; execution and P2P are separate. Similar in spirit to Tendermint Core or HotStuff implementations used as consensus engines.',
  },
];

const SUBCATEGORY_ORDER = [
  'Distributed Systems Fundamentals',
  'Consensus & Agreement',
  'Fault Models & Security',
  'Networking & Propagation',
  'Time Ordering & Race Conditions',
  'Cryptography & Hashing',
  'Blockchain & Ledgers',
  'State & Execution',
  'Scalability & Sharding',
  'Economics & Incentives',
  'Web3 & Applications',
  'Architecture',
];

// Expose for glossary.html immediately so the full-page glossary always has data (even if build below throws)
if (typeof window !== 'undefined') {
  window.GLOSSARY_ENTRIES = GLOSSARY_ENTRIES;
  window.SUBCATEGORY_ORDER = SUBCATEGORY_ORDER;
}

// Build GLOSSARY map for lookup: key -> { term, def, technicalDef, explain10yo, subCategory, competingConcepts, cat }
// Also support all keys (e.g. 'qc' -> same as 'quorum certificate')
const GLOSSARY = {};
GLOSSARY_ENTRIES.forEach((entry) => {
  const { key, keys, term, def, technicalDef, explain10yo, subCategory, competingConcepts } = entry;
  const primaryCat = subCategory && subCategory[0] ? subCategory[0] : 'Other';
  const obj = {
    term,
    def,
    technicalDef: technicalDef || def,
    explain10yo: explain10yo || '',
    subCategory: subCategory || [primaryCat],
    competingConcepts: competingConcepts || '',
    cat: primaryCat,
    key: key,
  };
  const allKeys = keys || [key];
  allKeys.forEach((k) => {
    if (k && !GLOSSARY[k.toLowerCase()]) GLOSSARY[k.toLowerCase()] = obj;
  });
  if (!GLOSSARY[key]) GLOSSARY[key] = obj;
});

const getGlossaryPath = () => (window.location.pathname.includes('/basic/') || window.location.pathname.includes('/hyperscale-rs/')) ? '../glossary.html' : 'glossary.html';

function renderGlossaryPage() {
  const container = document.getElementById('glossary-content');
  if (!container || !GLOSSARY_ENTRIES || !GLOSSARY_ENTRIES.length) return;
  const slug = (s) => (s || '').replace(/\s*&\s*/g, '-').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() || 'other';
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : text;
    return div.innerHTML;
  };
  const byCat = {};
  GLOSSARY_ENTRIES.forEach((entry) => {
    const primary = (entry.subCategory && entry.subCategory[0]) ? entry.subCategory[0] : 'Other';
    if (!byCat[primary]) byCat[primary] = [];
    byCat[primary].push(entry);
  });
  SUBCATEGORY_ORDER.forEach((cat) => {
    if (!byCat[cat]) return;
    byCat[cat].sort((a, b) => (a.term || '').localeCompare(b.term || ''));
  });
  const catsToRender = SUBCATEGORY_ORDER.filter((c) => byCat[c] && byCat[c].length);
  const orphanCats = Object.keys(byCat).filter((c) => !SUBCATEGORY_ORDER.includes(c));
  [...catsToRender, ...orphanCats.sort()].forEach((cat) => {
    const sectionId = 'cat-' + slug(cat);
    const section = document.createElement('div');
    section.className = 'section glossary-category';
    section.id = sectionId;
    section.innerHTML = '<h2 class="glossary-category-title">' + escapeHtml(cat) + '</h2><div class="glossary-entries"></div>';
    const entriesEl = section.querySelector('.glossary-entries');
    (byCat[cat] || []).forEach((item) => {
      const termId = 'term-' + (item.key || slug(item.term));
      const subCatTags = (item.subCategory || []).map((c) => '<span class="glossary-tag">' + escapeHtml(c) + '</span>').join(' ');
      const entryEl = document.createElement('article');
      entryEl.className = 'glossary-entry';
      entryEl.id = termId;
      entryEl.innerHTML =
        '<h3 class="glossary-term-title">' + escapeHtml(item.term) + '</h3>' +
        (subCatTags ? '<div class="glossary-meta">' + subCatTags + '</div>' : '') +
        '<div class="glossary-full-def"><span class="glossary-technical-label">Technical:</span> ' + escapeHtml(item.technicalDef || item.def) + '</div>' +
        (item.explain10yo ? '<div class="glossary-10yo"><span class="glossary-10yo-label">Explain to 10 year old:</span> ' + escapeHtml(item.explain10yo) + '</div>' : '') +
        (item.competingConcepts ? '<div class="glossary-competing"><span class="glossary-competing-label">Competing concepts / trade-offs:</span> ' + escapeHtml(item.competingConcepts) + '</div>' : '');
      entriesEl.appendChild(entryEl);
    });
    container.appendChild(section);
  });
  const hash = window.location.hash;
  if (hash) {
    const el = document.getElementById(hash.slice(1));
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('glossary-highlight');
      }, 150);
    }
  }
}

const positionTooltip = (tooltip, rect) => {
  const w = 320;
  let h = 180;
  let left = rect.left + (rect.width / 2) - (w / 2);
  let top = rect.bottom + 8;
  if (left + w > window.innerWidth) left = window.innerWidth - w - 10;
  if (left < 10) left = 10;
  if (top + h > window.innerHeight && rect.top > h) top = rect.top - h - 8;
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
};

function initializeGlossary() {
  const path = getGlossaryPath();
  let hoverTimeout, activeTooltip = null;

  const closeActiveTooltip = () => {
    if (activeTooltip) {
      activeTooltip.style.display = 'none';
      activeTooltip = null;
    }
    clearTimeout(hoverTimeout);
  };

  document.querySelectorAll('[data-glossary]').forEach((el) => {
    const key = (el.dataset.glossary || '').toLowerCase();
    const def = GLOSSARY[key];
    if (!def) return;

    el.classList.add('glossary-term');
    const termId = def.key ? `term-${def.key}` : `term-${key.replace(/\s+/g, '-')}`;
    const expandUrl = `${path}#${termId}`;

    const tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    tooltip.innerHTML =
      `<div class="tooltip-header"><strong>${def.term}</strong><span class="tooltip-category">${def.cat}</span></div>` +
      `<div class="tooltip-body">` +
      `<p class="tooltip-def">${def.def}</p>` +
      (def.explain10yo ? `<p class="tooltip-10yo"><em>Explain to 10 year old:</em> ${def.explain10yo}</p>` : '') +
      `</div>` +
      `<div class="tooltip-footer">` +
      `<a href="${expandUrl}" class="tooltip-expand" target="_blank" rel="noopener" onclick="event.stopPropagation()">Expand →</a>` +
      `</div>`;
    document.body.appendChild(tooltip);

    el.addEventListener('mouseenter', () => {
      closeActiveTooltip();
      activeTooltip = tooltip;
      tooltip.style.display = 'block';
      positionTooltip(tooltip, el.getBoundingClientRect());
    });

    el.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        if (activeTooltip === tooltip) {
          tooltip.style.display = 'none';
          activeTooltip = null;
        }
      }, 100);
    });

    tooltip.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
    tooltip.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      if (activeTooltip === tooltip) activeTooltip = null;
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeGlossary();
    if (document.getElementById('glossary-content')) renderGlossaryPage();
  });
} else {
  initializeGlossary();
  if (document.getElementById('glossary-content')) renderGlossaryPage();
}
