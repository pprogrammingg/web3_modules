/**
 * Shared “elite protocol engineer” lens for every module page.
 * Hyperscale-rs is the cutting-edge lab; skills transfer to any decentralized protocol team.
 * Loaded after navigation.js + course-data.js; invoked from module-init.js.
 */
(function () {
    'use strict';

    var LEVEL_PROTOCOL_TRACK = {
        1: {
            careerBand: 'Junior engineer → protocol-literate contributor',
            headline:
                'Build vocabulary and contribution reflexes that work at Ethereum clients, Cosmos stacks, or rollups—not only here.',
            whyLab:
                'Hyperscale-rs is a full Rust workspace with BFT, execution, and networking in one tree: ideal for learning how production chains actually fit together.',
            rustTips: [
                'Prefer explicit <code>Result</code> and <code>?</code> over <code>unwrap()</code> in code you intend to merge; reviewers read error paths as closely as happy paths.',
                'Run <code>cargo clippy --all-targets</code> before pushing—it catches idioms (e.g. needless collect) that separate Rust hobby code from production style.',
                'Unit tests live beside modules under <code>#[cfg(test)]</code>; mirror that layout so others navigate your changes instantly.'
            ],
            furtherReading: [
                {
                    title: 'The Rust Book — chapters 1–6',
                    url: 'https://doc.rust-lang.org/book/',
                    note: 'Ownership and error handling are the passport to reading consensus crates.'
                },
                {
                    title: 'Ethereum.org — consensus mechanisms overview',
                    url: 'https://ethereum.org/en/developers/docs/consensus-mechanisms/',
                    note: 'Context for PoS, validators, and finality narratives you will hear in every protocol job interview.'
                },
                {
                    title: 'Bitcoin whitepaper (2008)',
                    url: 'https://bitcoin.org/bitcoin.pdf',
                    note: 'Still the clearest short statement of the trust-minimization problem chains solve.'
                }
            ],
            funFacts: [
                'The term “Byzantine fault” comes from Lamport’s 1982 thought experiment about traitorous generals—decades before Bitcoin.',
                'Many production nodes spend more CPU on signature verification and deserialization than on “consensus math” in the narrow sense.',
                'Ethereum’s move to PoS slashing rules made economic alignment as important as message-count quorums—a theme you will see in any modern stake-based chain.'
            ]
        },
        2: {
            careerBand: 'Mid-level engineer → distributed-systems thinker',
            headline:
                'CAP, partial synchrony, and event-driven design are portable—you will reuse them at every layer from rollups to P2P infra.',
            whyLab:
                'Reading hyperscale-rs as event→state→action maps trains the same muscle as auditing geth, Lighthouse, or CometBFT-style codebases.',
            rustTips: [
                'Internal mutability (<code>RefCell</code>, <code>Mutex</code>) shows up at boundaries; prefer message passing (<code>crossbeam_channel</code>, Tokio mpsc) across threads to preserve reasoning.',
                'Understand <code>Send</code> + <code>Sync</code>: async runtimes and thread pools will reject designs that “felt fine” in single-threaded tests.',
                'When sharing config or clients, default to <code>Arc&lt;T&gt;</code> over cloning large structs in hot paths.'
            ],
            furtherReading: [
                {
                    title: 'Designing Data-Intensive Applications (Kleppmann) — ch. 8–9',
                    url: 'https://dataintensive.net/',
                    note: 'The industry-standard framing for replication, consistency, and fault models.'
                },
                {
                    title: 'Jepsen — consistency and isolation analyses',
                    url: 'https://jepsen.io/',
                    note: 'See how real systems behave under partitions—humbling and essential for protocol engineers.'
                },
                {
                    title: 'Asynchronous Programming in Rust',
                    url: 'https://rust-lang.github.io/async-book/',
                    note: 'Futures, pinning, and executors—before you reason about async runners around consensus.'
                }
            ],
            funFacts: [
                'Partial synchrony (eventually bounded message delays) is the usual formal sweet spot for practical BFT—that’s why chains don’t require identical clocks worldwide.',
                'The Google Chubby paper famous for Paxos in production is also a lesson in operational limits of consensus services.',
                'State-machine replication and blockchain consensus overlap heavily; many “web3” engineers under-index on classic SMR literature.'
            ]
        },
        3: {
            careerBand: 'Senior-minded engineer → codebase cartographer',
            headline:
                'Orientation beats brilliance: staff engineers win by knowing where safety-critical edges live and teaching others the map.',
            whyLab:
                'Transaction flow + crate groups mirror how serious teams split consensus, execution, and networking—skills that transfer directly to client architecture reviews.',
            rustTips: [
                'Learn workspace layout: <code>cargo tree -p crate_name</code> reveals dependency pressure and feature bleed.',
                'Feature flags: keep consensus-critical paths buildable with minimal features for CI and fuzzing.',
                'Prefer newtypes and crate-private modules over <code>pub use</code> re-export soup—API clarity is a security property.'
            ],
            furtherReading: [
                {
                    title: 'Tokio tutorial',
                    url: 'https://tokio.rs/tokio/tutorial',
                    note: 'How async tasks map to real I/O—the lens for production runners vs deterministic sims.'
                },
                {
                    title: 'The Rust API Guidelines',
                    url: 'https://rust-lang.github.io/api-guidelines/',
                    note: 'Naming, errors, and ergonomics—what “idiomatic” means in review.'
                },
                {
                    title: 'ethereum/consensus-specs (overview)',
                    url: 'https://github.com/ethereum/consensus-specs',
                    note: 'See how a major chain specifies fork choice, epochs, and penalties—compare to BFT-style specs.'
                }
            ],
            funFacts: [
                'Simulators in blockchain R&D often run deterministically so CI can replay failing traces bit-for-bit—a superpower for consensus debugging.',
                '“Transaction pool” and “mempool” naming varies by team; the responsibilities (validation, ordering, broadcast) are what matter in interviews.',
                'Google’s SRE book discipline (SLOs, error budgets) increasingly appears in L1/L2 node operational hiring loops.'
            ]
        },
        4: {
            careerBand: 'Senior engineer → consensus & sharding specialist',
            headline:
                'You are paid to reason about safety under adversarial networks and economic weights—not to memorize one codebase.',
            whyLab:
                'HotStuff-style rounds, QCs, and cross-shard coordination in-tree are excellent preparation for reviewing eth-consensus, Cosmos SDK modules, or rollup bridges.',
            rustTips: [
                'Hot paths: prefer stack buffers, <code>SmallVec</code>, or preallocated arenas over implicit heap churn in vote aggregation.',
                'Use <code>Cow&lt;’a, T&gt;</code> when you might borrow or own depending on API evolution.',
                'Avoid <code>clone()</code> in message handlers until profiling proves it is noise—then clone deliberately with comments.'
            ],
            furtherReading: [
                {
                    title: 'HotStuff (Yin et al., 2019)',
                    url: 'https://arxiv.org/abs/1803.05169',
                    note: 'Foundation for several modern BFT pipelines; read with coffee, not in one sitting.'
                },
                {
                    title: 'PBFT original paper (Castro & Liskov)',
                    url: 'http://pmg.csail.mit.edu/papers/osdi99.pdf',
                    note: 'Classic vocabulary for prepare/commit and view changes.',
                    optional: true
                },
                {
                    title: 'CometBFT documentation — consensus overview',
                    url: 'https://docs.cometbft.com/main/consensus/',
                    note: 'Different lineage than HotStuff, same engineering conversations in production Cosmos chains.'
                }
            ],
            funFacts: [
                'Finality gadgets and fork-choice rules can both exist in one stack—teams argue where to put “economic finality” vs “BFT finality”.',
                'Validator stake ≠ voting weight automatically in every codebase; mapping economics to consensus is an active design space industry-wide.',
                'Sharding discussions usually boil down to cross-shard atomicity vs latency tradeoffs—exactly the receipts/provisions conversations in advanced modules.'
            ]
        },
        5: {
            careerBand: 'Senior / Staff- → execution, cryptography & liveness',
            headline:
                'Staff engineers connect VMs, crypto primitives, and timers without letting leaks collapse isolation guarantees.',
            whyLab:
                'Radix-flavored execution hooks plus network crypto in Rust mirror how teams integrate engines (EVM, Move, WASM) with consensus elsewhere.',
            rustTips: [
                'Cryptographic code: prefer audited crates (<code>ring</code>, <code>ed25519-dalek</code>, etc.) and avoid branching on secret bytes—timing leaks are CVEs.',
                'Use <code>zeroize</code> on sensitive buffers; secrets lingering in memory are an ops nightmare.',
                'Async timers vs deterministic timers: document which clock domain each code path assumes—mixed clocks cause phantom bugs.'
            ],
            furtherReading: [
                {
                    title: 'RustCrypto project',
                    url: 'https://github.com/RustCrypto',
                    note: 'Ecosystem map for primitives and when to defer to FFI for audited C/asm.'
                },
                {
                    title: 'Ethereum yellow paper (historical execution model)',
                    url: 'https://ethereum.github.io/yellowpaper/paper.pdf',
                    note: 'Dense—skim gas/state sections to appreciate execution consensus coupling.'
                },
                {
                    title: '"Constant-time" crypto primer (BearSSL)',
                    url: 'https://bearssl.org/constanttime.html',
                    note: 'Why branch-free patterns matter for implementations you ship.'
                },
                {
                    title: 'The Rustonomicon',
                    url: 'https://doc.rust-lang.org/nomicon/',
                    note: 'When you touch unsafe FFI around crypto or syscall-heavy paths.',
                    optional: true
                }
            ],
            funFacts: [
                'Batch signature verification is one of the highest ROI optimizations in high-throughput chains—often bigger than micro-optimizing hash loops.',
                'BLS aggregation shines when many signers attest the same message; wrong assumptions about distinct messages break soundness fast.',
                'Liveness bugs (stalling rounds) show up in ops more often than classic safety violations—monitoring and timeouts are first-class design artifacts.'
            ]
        },
        6: {
            careerBand: 'Staff engineer → measurement, reliability & proof culture',
            headline:
                'Elite protocol engineers ship evidence: traces, benches, and tests that make incidents boring.',
            whyLab:
                'Simulation vs production metrics and E2E harnesses are how serious teams prevent regressions when merging consensus-adjacent PRs.',
            rustTips: [
                'Microbenchmarks: <code>criterion</code> with statistically robust sampling; never trust a single <code>Instant::now()</code> lap.',
                'Use structured tracing (<code>tracing</code> crate) with consistent spans so log correlation works across validators.',
                'Property tests (<code>proptest</code>) pair beautifully with deterministic state machines—encode invariants once.'
            ],
            furtherReading: [
                {
                    title: 'Systems Performance (Gregg) — USE method',
                    url: 'http://www.brendangregg.com/usemethod.html',
                    note: 'Practical utilization/saturation/errors framing for node perf.',
                    optional: true
                },
                {
                    title: 'OpenTelemetry',
                    url: 'https://opentelemetry.io/docs/',
                    note: 'How modern stacks unify traces/metrics—the lingua franca of reliability interviews.'
                },
                {
                    title: 'cargo bench & criterion.rs book',
                    url: 'https://bheisler.github.io/criterion.rs/book/criterion_rs.html',
                    note: 'Rust-native regression detection for hot paths.'
                }
            ],
            funFacts: [
                '“Works on my laptop” is not a strategy—top teams gate merges on replayable scenarios and diff-friendly artifacts.',
                'Flaky tests destroy protocol teams faster than slow tests; determinism is a cultural value.',
                'SLOs for block propagation delay are now common in validator SLA discussions—measurement literacy is leadership material.'
            ]
        },
        7: {
            careerBand: 'Staff / Principal → P2P production & platform leadership',
            headline:
                'You shape gossip meshes, operator UX, and incident response—where protocol design meets SRE and governance.',
            whyLab:
                'libp2p + systemd-style packaging exercises are the same muscles needed to ship node software at Ethereum Foundation, major rollup sequencers, or L1 foundations.',
            rustTips: [
                'Backpressure everywhere: bounded channels, explicit drops, and metrics on queue depth—unbounded buffers hide outages until they’re catastrophic.',
                'Prefer compile-time protocol versioning where possible; runtime negotiation belongs at the wire layer with explicit caps.',
                'FFI and syscall boundaries: isolate unsafe blocks; document preconditions for crypto and socket code.'
            ],
            furtherReading: [
                {
                    title: 'libp2p documentation',
                    url: 'https://docs.libp2p.io/',
                    note: 'Transports, muxers, pubsub—your vocabulary for protocol networking reviews.'
                },
                {
                    title: 'GossipSub spec',
                    url: 'https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.0.md',
                    note: 'Mesh, IHAVE, and backoff behavior—where production gossip surprises hide.'
                },
                {
                    title: 'Production-ready systemd unit guidelines',
                    url: 'https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html',
                    note: 'Operators judge chains partly by how calmly nodes restart.'
                }
            ],
            funFacts: [
                'Gossip protocols trade bandwidth for resilience; “efficient” and “robust” pull in opposite directions on constrained networks.',
                'Peer scoring and ban lists are operational necessities—libp2p is not “magic connectivity”.',
                'Many outages are config + deployment issues, not math bugs—staff engineers invest in templates and runbooks early.'
            ]
        }
    };

    function findModuleCourseLevel(moduleId) {
        if (typeof COURSE_DATA === 'undefined' || !moduleId) return null;
        var buckets = COURSE_DATA.levels;
        for (var k in buckets) {
            if (!Object.prototype.hasOwnProperty.call(buckets, k)) continue;
            var mods = buckets[k].modules || [];
            for (var i = 0; i < mods.length; i++) {
                if (mods[i].id === moduleId) {
                    var L = mods[i].courseLevel;
                    return L != null ? Number(L) : null;
                }
            }
        }
        return null;
    }

    function pickRotating(arr, key) {
        if (!arr || !arr.length) return '';
        var h = 0;
        var s = String(key);
        for (var i = 0; i < s.length; i++) {
            h = ((h << 5) - h + s.charCodeAt(i)) | 0;
        }
        return arr[Math.abs(h) % arr.length];
    }

    function pickTwoDistinct(arr, key) {
        if (!arr || !arr.length) return [];
        if (arr.length === 1) return [arr[0]];
        var a = pickRotating(arr, key);
        var b = pickRotating(arr, key + '2');
        if (a === b && arr.length > 1) {
            b = arr[(arr.indexOf(a) + 1) % arr.length];
        }
        return [a, b];
    }

    function renderReadingList(items) {
        var html = '<ul class="elite-reading-list">';
        for (var i = 0; i < items.length; i++) {
            var r = items[i];
            if (r.optional) continue;
            html +=
                '<li><a href="' +
                r.url +
                '" target="_blank" rel="noopener noreferrer">' +
                r.title +
                '</a> — ' +
                r.note +
                '</li>';
        }
        for (var j = 0; j < items.length; j++) {
            var o = items[j];
            if (!o.optional) continue;
            html +=
                '<li class="elite-reading-optional"><a href="' +
                o.url +
                '" target="_blank" rel="noopener noreferrer">' +
                o.title +
                '</a> — ' +
                o.note +
                '</li>';
        }
        html += '</ul>';
        return html;
    }

    function injectProtocolEngineerPanel(moduleId) {
        var L = findModuleCourseLevel(moduleId);
        if (L == null || !LEVEL_PROTOCOL_TRACK[L]) return;

        if (document.getElementById('elite-protocol-track')) return;

        var track = LEVEL_PROTOCOL_TRACK[L];
        var rustPair = pickTwoDistinct(track.rustTips, moduleId + '-rust');
        var rustItemsHtml = '';
        if (rustPair[0]) rustItemsHtml += '<li>' + rustPair[0] + '</li>';
        if (rustPair[1]) rustItemsHtml += '<li>' + rustPair[1] + '</li>';
        var funFact = pickRotating(track.funFacts, moduleId + '-fun');

        var nav = document.querySelector('.course-content .navigation');
        var host = document.querySelector('.course-content');
        if (!host) return;

        var section = document.createElement('section');
        section.className = 'elite-track-panel';
        section.id = 'elite-protocol-track';
        section.setAttribute('aria-labelledby', 'elite-protocol-track-heading');

        section.innerHTML =
            '<h2 id="elite-protocol-track-heading">Protocol engineer track · Level ' +
            L +
            '</h2>' +
            '<p class="elite-track-lede">' +
            '<strong>Career lens (' +
            track.careerBand +
            ').</strong> ' +
            track.headline +
            '</p>' +
            '<p class="elite-track-lab">' +
            '<strong>Why Hyperscale-rs as lab:</strong> ' +
            track.whyLab +
            '</p>' +
            '<div class="elite-track-grid">' +
            '<div class="elite-card elite-card--rust">' +
            '<h3>Rust depth &amp; idioms</h3>' +
            '<ul class="elite-tip-list">' +
            rustItemsHtml +
            '</ul></div>' +
            '<div class="elite-card elite-card--reading">' +
            '<h3>Go deeper (beyond this repo)</h3>' +
            renderReadingList(track.furtherReading) +
            '</div>' +
            '<div class="elite-card elite-card--fun">' +
            '<h3>Protocol snack</h3>' +
            '<p class="elite-fun-fact">' +
            funFact +
            '</p>' +
            '</div></div>' +
            '<p class="elite-track-foot">This journey is designed for repeated passes—junior → tech lead → staff. Come back as your scope widens; the readings and Rust notes gain new edges.</p>';

        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(section, nav);
        } else {
            host.appendChild(section);
        }
    }

    window.injectProtocolEngineerPanel = injectProtocolEngineerPanel;
    window.findModuleCourseLevel = findModuleCourseLevel;
})();
