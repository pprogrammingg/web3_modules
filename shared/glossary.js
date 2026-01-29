// Glossary definitions - consolidated (no duplicates)
const GLOSSARY = {
    'finality': { term: 'Finality', def: 'The property that once a block is committed, it cannot be reverted or changed. In BFT systems, finality is deterministic and immediate once a block gets a QC and the next block also gets a QC (two-chain rule).', cat: 'Consensus' },
    'quorum certificate': { term: 'Quorum Certificate (QC)', def: 'Cryptographic proof that at least 2f+1 validators have voted for a block. It\'s an aggregated signature from a quorum of validators that proves agreement on a specific block.', cat: 'Consensus' },
    'qc': { term: 'Quorum Certificate (QC)', def: 'Cryptographic proof that at least 2f+1 validators have voted for a block. It\'s an aggregated signature from a quorum of validators that proves agreement on a specific block.', cat: 'Consensus' },
    'bft': { term: 'Byzantine Fault Tolerance (BFT)', def: 'The ability of a system to function correctly even when some nodes are Byzantine (malicious or faulty). In a BFT system with n = 3f + 1 nodes, up to f nodes can be Byzantine.', cat: 'Consensus' },
    'byzantine fault tolerance': { term: 'Byzantine Fault Tolerance (BFT)', def: 'The ability of a system to function correctly even when some nodes are Byzantine (malicious or faulty). In a BFT system with n = 3f + 1 nodes, up to f nodes can be Byzantine.', cat: 'Consensus' },
    'pbft': { term: 'PBFT (Practical Byzantine Fault Tolerance)', def: 'A classic BFT consensus protocol that requires three-phase commit, three-chain commit rule, and coordinated view changes. Uses O(n²) communication complexity.', cat: 'Consensus' },
    'view change': { term: 'View Change', def: 'The process of changing the leader/proposer when the current leader is suspected of being faulty. In PBFT, this requires coordinated voting. In HotStuff-2, view changes are implicit.', cat: 'Consensus' },
    'coordinated view-change': { term: 'Coordinated View-Change', def: 'In PBFT, when nodes suspect the leader is faulty, they must coordinate a view-change through explicit voting. This requires all nodes to detect the problem, vote to change the view, agree on a new leader, and synchronize state.', cat: 'Consensus' },
    'implicit view change': { term: 'Implicit View Change', def: 'In HotStuff-2, if a block doesn\'t get a QC within a timeout, nodes automatically advance to the next view/leader without explicit voting. The next leader proposes, and if it gets a QC, the view change is implicitly accepted.', cat: 'Consensus' },
    'two-chain commit': { term: 'Two-Chain Commit', def: 'A block commits when both it and the next block have QCs. This ensures finality with only 2 blocks (vs 3 in PBFT), reducing latency.', cat: 'Consensus' },
    'three-chain commit': { term: 'Three-Chain Commit', def: 'In PBFT, a block only commits after three consecutive blocks have QCs. This requires blocks at heights H, H+1, and H+2 to all have QCs before H commits.', cat: 'Consensus' },
    'quorum': { term: 'Quorum', def: 'A group of at least 2f+1 validators in a BFT system with 3f+1 total nodes. Any two quorums must overlap in at least one honest node, ensuring agreement.', cat: 'Consensus' },
    'blockchain': { term: 'Blockchain', def: 'A distributed ledger that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography. Each block contains transactions, a hash, and a reference to the previous block.', cat: 'Blockchain' },
    'decentralization': { term: 'Decentralization', def: 'The distribution of control and decision-making across multiple nodes rather than a single central authority. In blockchain, this means no single point of control or failure.', cat: 'Blockchain' },
    'immutability': { term: 'Immutability', def: 'The property that once data is recorded on a blockchain, it is extremely difficult to change. This comes from cryptographic hashing and the chaining of blocks.', cat: 'Blockchain' },
    'merkle root': { term: 'Merkle Root', def: 'A cryptographic hash of all transactions in a block, organized in a Merkle tree. Allows efficient verification that a transaction is included in a block without downloading all transactions.', cat: 'Blockchain' },
    'state machine': { term: 'State Machine', def: 'A computational model where the system is always in one of a finite number of states. Transitions between states are triggered by events and produce actions. Used in hyperscale-rs for deterministic consensus logic.', cat: 'Architecture' },
    'event-driven': { term: 'Event-Driven Architecture', def: 'An architectural pattern where events flow into the system, trigger state transitions, and produce actions. In hyperscale-rs, Events flow into state machines, and Actions flow out.', cat: 'Architecture' },
    'deterministic': { term: 'Deterministic', def: 'Given the same input and state, the system always produces the same output. Critical for blockchain consensus to ensure all nodes reach the same state.', cat: 'Architecture' },
    'hyperscale-rs': { term: 'Hyperscale-rs', def: 'A Rust implementation of the Hyperscale consensus protocol - a BFT consensus system designed for high-throughput, sharded blockchain networks. It\'s a pure consensus layer, not a full blockchain platform.', cat: 'Project' },
    'sharding': { term: 'Sharding', def: 'Dividing a blockchain network into multiple parallel chains (shards) that can process transactions independently. This increases throughput by allowing parallel processing.', cat: 'Blockchain' },
    'cross-shard transaction': { term: 'Cross-Shard Transaction', def: 'A transaction that involves multiple shards. Requires coordination between shards, typically using protocols like 2PC (Two-Phase Commit) to ensure atomicity.', cat: 'Blockchain' }
};

const getGlossaryPath = () => (window.location.pathname.includes('/basic/') || window.location.pathname.includes('/hyperscale-rs/')) ? '../glossary.html' : 'glossary.html';

const positionTooltip = (tooltip, rect) => {
    const w = 300, h = 150;
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
    
    document.querySelectorAll('[data-glossary]').forEach(el => {
        const def = GLOSSARY[el.dataset.glossary.toLowerCase()];
        if (!def) return;
        
        el.classList.add('glossary-term');
        const tooltip = document.createElement('div');
        tooltip.className = 'glossary-tooltip';
        tooltip.innerHTML = `<div class="tooltip-header"><strong>${def.term}</strong><span class="tooltip-category">${def.cat}</span></div><div class="tooltip-body">${def.def}</div><div class="tooltip-footer"><a href="${path}" class="tooltip-link" onclick="event.stopPropagation()">View full glossary →</a></div>`;
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
    document.addEventListener('DOMContentLoaded', initializeGlossary);
} else {
    initializeGlossary();
}
