# Hyperscale-rs flow data

**Code-sync driver (this track):** `node scripts/reflect-changes.js hyperscale` — see **`scripts/reflect-changes.js`** for the consolidated CLI (`solana-core` is the other track).

Single source of truth: **`common/hyperscale-flow-data.js`**. Teaching modules get repo/crate/file URLs from here via **`common/hyperscale-links.js`** (`data-repo`, `data-crate`, `data-file`). No hardcoded GitHub URLs in HTML.

**Module page shell** (nav, `.course-content`, tables, backgrounds) matches other tracks — see **`common/MODULE_PAGE.md`**. After CSS or module HTML changes, run **`bash tests/run-all.sh`** from the repo root (includes **hyperscale-reflect-contract** at step 4c).

**Block anatomy cards** (Phase 1–4): cumulative `BlockHeader` + body fields at teaching steps via **`common/block-evolution-data.js`** + **`common/block-evolution.js`**. New fields render in pistachio green; earlier fields stay muted. Field hovers reuse **`glossary.js`** tooltips (same `data-glossary` / Expand link) — no duplicate `block-field-*` entries; existing terms gained aliases (`parent_qc`, `state_root`, …) and optional **`blockFieldMeta.phaseSteps`**. **Bird's-eye map:** **`module-01b-tx-flow.html`** (`data-block-birdseye`) renders **`BIRDSEYE_ROWS`** — tx flow step → phase → block card → new fields. Contracts: **`tests/block-evolution-contract.js`** (5c), **`tests/block-evolution-reflect-contract.js`** (4c2 — compares taught fields to `crates/types/src/shard/header.rs` + `block.rs` in local clone).

## When hyperscale-rs is updated

1. **Use the local clone only.** Do not fetch or verify content from GitHub. The clone path is in **`scripts/hyperscale-repo.config.js`** (default `../other_projects/hyperscale-rs`); override with **`LOCAL_REPO_PATH=/path/to/hyperscale-rs`**.
2. **Edit** `common/hyperscale-flow-data.js` — `REPO_BASE_URL`, `CRATES`, `FILE_REFS` as needed (e.g. after renames). For large symbol moves, run **`node scripts/apply-hyperscale-repo-reflect.js`** then hand-fix prose.
3. **See what to re-check:** Run **`node scripts/reflect-changes.js hyperscale`** (no diff arg). It diffs the **local** hyperscale-rs repo against the stored baseline in **`common/hyperscale-rs-last-synced.txt`** (or `main` if the file is missing). Re-check the listed modules against the local repo. (Legacy: `node scripts/check-hyperscale-changes.js` — same behavior.)
4. **After updating modules**, run **`node scripts/reflect-changes.js hyperscale --save`** to record current hyperscale-rs HEAD as the new baseline. Paths under `vendor/` are ignored.
5. **Verify course matches clone:** **`node tests/hyperscale-reflect-contract.js`** (or full **`bash tests/run-all.sh`**) — baseline HEAD, `FILE_REFS` + `CRATES`, `hyperscale-config.json`, `course-data.js` / `navigation.js`, no stale paths in `hyperscale/**/*.html`.
6. **Ladder-only edits** (reorder modules, no upstream pull): **`node scripts/rebuild-hyperscale-course-data.js`** regenerates the Hyperscale block in **`common/course-data.js`**; then **`node verify-paths.js`** and **`node tests/hub-href-contract.js`**.

Output includes changed files (excluding vendor), affected FILE_REFS, affected crates, and **teaching modules to re-check**. Links stay correct from step 1; only update HTML if step titles or prose reference moved/renamed code.

### Command checklist (what to run when)

| When | Commands |
|------|----------|
| After `git pull` in hyperscale-rs | `reflect-changes.js hyperscale` → edit modules / flow-data / **block-evolution-data.js** if `BlockHeader` changed → `--save` → `hyperscale-reflect-contract.js` + **`block-evolution-reflect-contract.js`** |
| Large symbol/path renames | `apply-hyperscale-repo-reflect.js` then manual prose → steps above |
| Before commit (any Hyperscale touch) | **`bash tests/run-all.sh`** |
| Reordered Hyperscale modules only | `rebuild-hyperscale-course-data.js` → `verify-paths.js` |
| CSS / module shell only | `run-all.sh` (steps 4b–4e) is enough if you did not pull upstream |

## flow-data.js fields

- **REPO_BASE_URL**, **CRATES** — repo and crate paths; links are built from these.
- **FILE_REFS** — paths `reflect-changes.js hyperscale` matches against git diff.
- **MODULE_USAGE** — flow ID → module paths (under **`hyperscale/`** in this repo); script uses this to list modules to re-check.

## Data-driven links

Pages must load `hyperscale-flow-data.js` and `hyperscale-links.js`. Use `data-repo`, `data-crate="name"`, `data-file="path"` on `<a>` tags.

## Adding a flow or module

Add steps/refs to `hyperscale-flow-data.js`, add `MODULE_USAGE` entry, and any paths to `FILE_REFS`.

## Flow → modules

HTML paths are under **`hyperscale/hyperscale-rs/`** in this repo.

| Flow | Modules |
|------|---------|
| tx-flow | module-01b-tx-flow.html |
| bft-* (shard consensus) | module-phase-02-propose-vote-commit.html, module-phase-04-cross-shard-tx.html |
| beacon / topology | glossary: **beacon chain**, **topology snapshot**; `crates/beacon`, Phase 2 scope pill |
| 2pc-flow, provision-flow | module-phase-04-cross-shard-tx.html |
| overview-flow-* | module-01-overview.html |
| crate-groups | module-01b-tx-flow.html, module-01c-crate-groups.html |
| file-refs-general | module-phase-03/04, module-01-overview.html, module-08-cryptography.html |
