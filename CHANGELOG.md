# Changelog

All notable changes to the web3_modules course are listed here by date.

---

## Since Feb 05, 2026

- **New module: Transaction Flow: User to Finality** — End-to-end diagram (user → finality), Hyperscale vs outside, BFT/shards/proposer/NodeID/cross-shard/2PC; hover popups for crates; 21-question quiz.
- **Module improvements:** Exploring the Codebase — harder quiz (5 questions, plausible distractors). First Contribution — quiz removed; PR/commit message format and other concepts moved into guidelines.
- **Mobile:** Nav buttons stack on small screens, full-width with gap; labels centered (e.g. “Next Module →”). Added **mobile-test.html** for layout checks.

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
