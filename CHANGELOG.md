# Changelog

All notable changes to the web3_modules course are listed here. **Entries are grouped by the date the change occurred** (newest first).

---

## 2026-02-11

- **Basic level: one Hyperscale module** — Basic now has at most one Hyperscale-focused module: <strong>Transaction Flow: User to Finality</strong> (<code>module-01b-tx-flow.html</code>). Overview, Crate Groups, Codebase Exploration, and First Contribution are moved to <strong>Intermediate</strong> (ids: <code>intermediate-hs-overview</code>, <code>intermediate-hs-crate-groups</code>, <code>intermediate-hs-codebase</code>, <code>intermediate-hs-first-contribution</code>). Tx Flow includes the full practical section: run the code, follow one tx with a debugger (breakpoints: SubmitTransaction/TransactionGossipReceived → BlockCommitted → TransactionExecuted → Completed), use the crate table to jump in the codebase, and where to look when things go wrong (Pending → mempool/gossip; block not committing → BFT/QC; cross-shard stuck → certificates). Nav: Basic ends with State Machines → Transaction Flow; then Intermediate starts with Overview → Crate Groups → Codebase → First Contribution → BFT → …
- **Unified basic path (basic_hyperscale.md)** — Basic web3 modules are unified with the transaction flow. **Transaction Flow** module (<code>module-01b-tx-flow.html</code>) now includes: (1) Crate groupings table (six groups by tx-flow progression), (2) **Practical** section (run code, follow one tx with a debugger, where to look when things go wrong), (3) link to Crate Groups and a short “unified path” note (Overview → Tx Flow → Crate Groups → Practical → Codebase → First Contribution). **Crate Groups** module (<code>module-01c-crate-groups.html</code>) added: Groups 1–6 (First contact, Sharding, Proposing, Voting, Execution, Cross-shard) with one-liners, code bullets, and **10 questions per group** (60 total); pass 70% per quiz. Tx Flow quiz trimmed to **10 questions** (big picture). <code>verify-paths.js</code> allows same-dir <code>.js</code> scripts (e.g. <code>module-01c-crate-groups-quizzes.js</code>).
- **Transaction Flow styling** — Transaction Flow module (<code>module-01b-tx-flow.html</code>) can lose CSS when opened from another module (e.g. intermediate) or in a new tab. Added a small in-head fallback script that detects when the main stylesheet did not load and injects a second <code>link</code> using a path derived from <code>location.pathname</code>, so styles load even when the document URL is resolved differently.
- **Content link styling** — In-module links (to other modules, Transaction Flow, etc.) now use the course primary color, subtle underline on hover, and a small “↗” for <code>target="_blank"</code> links. Styles live in <code>shared/styles.css</code> under <code>.course-content .section a</code> and <code>a[href*=".html"]</code>.
- **Tests to prevent broken links and missing styles** — <code>verify-paths.js</code> now: (1) Resolves each module’s stylesheet <code>href</code> relative to the module’s directory and fails if the resolved file does not exist. (2) Finds every <code>a[href*=".html"]</code>, resolves the path (ignoring hash/query), and fails if the target file does not exist. This catches wrong relative paths (e.g. from <code>intermediate/</code> linking to <code>module-01b-tx-flow.html</code> without <code>../hyperscale-rs/</code>).
- **Refactors** — **verify-paths.js**: Module list is now derived from <code>course-data.js</code> (single source of truth); expected CSS path is computed from each module’s directory depth; <code>glossary.js</code> added to shared-files check. **navigation.js**: Status labels and classes for module cards moved into a <code>STATUS_CONFIG</code> map. **test-modules.html**: Uses <code>COURSE_DATA</code> and <code>isModuleAvailable()</code> instead of a hardcoded module list; loads <code>navigation.js</code>. **course-data.js**: Comment added that it is the source of truth for module ids/paths.
- **CHANGELOG** — From now on, updates are grouped by date of change (this date format).

---

## 2026-02-04

- **Intermediate modules (next set) released** — Three new intermediate modules: **BFT Consensus Implementation Deep Dive** (<code>hyperscale-rs/module-04-bft-implementation.html</code>), **Sharding & Cross-Shard Transactions** (<code>intermediate/module-01-sharding.html</code>), **Transaction Execution & Radix Engine** (<code>hyperscale-rs/module-06-execution.html</code>). Relative paths and nav chained: First Contribution → BFT → Sharding → Cross-Shard → Execution.
- **Transaction Flow** — New module: path from user transaction submit to finality (wallet → network → node → mempool → BFT → commit → execution → cross-shard). Diagram with crate hover popups and quiz. Quiz results highlight wrong vs correct answers.
- **Quizzes** — Wrong-answered questions and wrong-chosen options highlighted after submit. Added test-quiz.js; Codebase Exploration quiz hardened; First Contribution quiz removed in favor of guidelines.
- **Content & glossary** — Distributed Systems expanded (partial synchrony/GST, safety vs liveness, quorum intersection, leader/view/timeouts). FLP, GST, PBFT linked and expanded. Guides = repo <code>guides/</code>; module references to guides and key files now link to GitHub.
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
