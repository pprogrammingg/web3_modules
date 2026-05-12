# Changelog

All notable changes to the web3_modules course are listed here. **Entries are grouped by the date the change occurred** (newest first).

---

## 2026-05-12

- **Tests:** `tests/run-all.sh` is the canonical suite (`verify-paths` → `sanity-pages` → `js-syntax-check` → `render-contracts` → quiz contracts → mobile-test presence). `test-all.sh` delegates to it. `tests/README.md` documents order and when to run each stage; `TESTING.md` points there.
- **New checks:** `tests/js-syntax-check.js` (`node --check` on shared JS), `tests/render-contracts.js` (HTML skeleton markers for landing + hubs + glossary).
- **Removed bloat:** Dropped redundant `test-all.sh` grep steps (file/CSS/JS string greps); quiz checks live under `tests/test-quiz.js` only.
- **`common/module-init.js`:** Table-driven dispatch for crypto / ZK / EVM module pages + protocol panel skip logic.
- **`scripts/sanity-pages.js`:** Course data file list + parallel track HTML walks consolidated into small loops.
- **Hub links:** `courseModuleHrefForHub` in `common/navigation.js` + parallel track navigations — course `path` values stay repo-root-relative for `verify-paths`, but hub cards now use track-relative `href`s so `/evm/index.html` no longer points at `/evm/evm/...`. Regression guard: `tests/hub-href-contract.js`.

---

## 2026-02-17

- Crate Groups: Quick Test and repo reading links added.
- Codebase Exploration module removed from course.
- Crate Groups "Next" now BFT; BFT "Previous" now Crate Groups.
- Cryptography in Hyperscale-rs module: Why BLS, signature table.
- Libp2p modules + shared assets; Hyperscale Overview: 3 sections (intro, tracing, Crate Groups).

---

## 2026-02-11

- Basic: one Hyperscale module (Tx Flow); rest moved to Intermediate.
- Crate Groups: six groups, 10 questions each, 70% pass.
- Transaction Flow: CSS fallback when opened from other modules.
- Link styling: primary color, hover underline, external icon.
- verify-paths: checks stylesheet and HTML link targets exist.

---

## 2026-02-04

- Three new intermediate modules: BFT, Sharding, Execution.
- Transaction Flow module: submit-to-finality diagram and quiz.
- Quizzes: wrong answers highlighted after submit.
- Distributed Systems expanded; guides link to GitHub.
- UI: card layout, mobile fixes, test page.

---

## 2025-01-29

- Consensus table (BFT vs PoS) corrected in Module 1.2.
- CHANGELOG and README build/open instructions added.

---

## Earlier

- Glossary tooltips, code blocks, two-chain diagram.
- PBFT, view-change, QC, finality, contribution roadmap.
- GitHub Pages, path fixes, module cards and badges.
