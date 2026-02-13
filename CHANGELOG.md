# Changelog

All notable changes to the web3_modules course are listed here by date.

---

## Since Feb 4, 2026

- **Refactors** — **verify-paths.js**: Module list is now derived from <code>course-data.js</code> (single source of truth); expected CSS path is computed from each module’s directory depth; <code>glossary.js</code> added to shared-files check. **navigation.js**: Status labels and classes for module cards moved into a <code>STATUS_CONFIG</code> map. **test-modules.html**: Uses <code>COURSE_DATA</code> and <code>isModuleAvailable()</code> instead of a hardcoded module list; loads <code>navigation.js</code>. **course-data.js**: Comment added that it is the source of truth for module ids/paths.
- **Intermediate modules (next set) released** — Three new intermediate modules are available: **BFT Consensus Implementation Deep Dive** (<code>hyperscale-rs/module-04-bft-implementation.html</code>), **Sharding & Cross-Shard Transactions** (<code>intermediate/module-01-sharding.html</code>, general), **Transaction Execution & Radix Engine** (<code>hyperscale-rs/module-06-execution.html</code>). Relative paths: hyperscale-rs modules use <code>../shared/</code> and same-dir links for other hyperscale-rs modules; intermediate modules use <code>../shared/</code> and <code>../hyperscale-rs/</code> for Hyperscale-specific links. Navigation chained: First Contribution → BFT → Sharding (general) → Cross-Shard (Hyperscale) → Execution. <code>AVAILABLE_MODULES</code> and <code>verify-paths.js</code> updated.
- **Transaction Flow** — New module: path from user transaction submit to finality (wallet → network → node → mempool → BFT → commit → execution → cross-shard). Diagram with crate hover popups and quiz. Quiz results highlight wrong vs correct answers.
- **Quizzes** — Wrong-answered questions and wrong-chosen options highlighted after submit. Added test-quiz.js; Codebase Exploration quiz hardened; First Contribution quiz removed in favor of guidelines.
- **Content & glossary** — Distributed Systems expanded (partial synchrony/GST, safety vs liveness, quorum intersection, leader/view/timeouts). FLP, GST, PBFT linked and expanded. Guides = repo `guides/`; module references to guides and key files now link to GitHub.
- **UI** — Resources on index: card-style layout, clearer hierarchy. In-module links to repo files and guides made explicit. Mobile layout fixes and a dedicated mobile test page.

---

## 2025-01-29

- **Consensus comparison table (BFT vs PoS)**: Verified and corrected the comparison table in Module 1.2 (Consensus Basics).
  - **PoS communication**: Updated from "O(1) per block" to "Often O(n) among validators (when BFT-style)" to match real PoS designs (e.g. Ethereum 2.0, Tendermint).
  - **PoS fault tolerance**: Clarified from "Up to 50% stake" to "Honest majority of stake (<50% adversarial)" for accuracy.
  - **BFT fault tolerance**: Clarified as "Up to f of 3f+1 Byzantine (≤1/3)".
  - **Finality (PoS)**: Refined to "Probabilistic or economic; often requires time."
  - **Context**: Added short intro comparing classic BFT (fixed set) vs open PoS (stake-weighted), and a **Proof of Work (PoW)** paragraph so PoW is included in the comparison.
- **Docs**: Added CHANGELOG.md and clarified in README how to build and open the project (no `scripts/build-data.js`; open `index.html` or use a local server).

---

## Earlier

- Glossary system (hover tooltips, glossary page), code block formatting (Rust/shell in `<pre><code class="language-*">`), two-chain diagram and finality explanation, BFT vs CFT/PoS table styling (centered headers and cells), single-tooltip behavior for glossary popups.
- Module content: PBFT, view-change, QC mechanics, finality, contribution roadmap.
- GitHub Pages deployment, path fixes for CSS/JS, module card layout and badges.
