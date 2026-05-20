# Hyperscale-rs flow data

**Code-sync driver (this track):** `node scripts/reflect-changes.js hyperscale` — see **`scripts/reflect-changes.js`** for the consolidated CLI (`solana-core` is the other track).

Single source of truth: **`common/hyperscale-flow-data.js`**. Teaching modules get repo/crate/file URLs from here via **`common/hyperscale-links.js`** (`data-repo`, `data-crate`, `data-file`). No hardcoded GitHub URLs in HTML.

## When hyperscale-rs is updated

1. **Use the local clone only.** Do not fetch or verify content from GitHub. The clone path is in **`scripts/hyperscale-repo.config.js`** (default `../other_projects/hyperscale-rs`); override with **`LOCAL_REPO_PATH=/path/to/hyperscale-rs`**.
2. **Edit** `common/hyperscale-flow-data.js` — `REPO_BASE_URL`, `CRATES`, `FILE_REFS` as needed (e.g. after renames).
3. **See what to re-check:** Run **`node scripts/reflect-changes.js hyperscale`** (no diff arg). It diffs the **local** hyperscale-rs repo against the stored baseline in **`common/hyperscale-rs-last-synced.txt`** (or `main` if the file is missing). Re-check the listed modules against the local repo. (Legacy: `node scripts/check-hyperscale-changes.js` — same behavior.)
4. **After updating modules**, run **`node scripts/reflect-changes.js hyperscale --save`** to record current hyperscale-rs HEAD as the new baseline. Paths under `vendor/` are ignored.

Output includes changed files (excluding vendor), affected FILE_REFS, affected crates, and **teaching modules to re-check**. Links stay correct from step 1; only update HTML if step titles or prose reference moved/renamed code.

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
| bft-* | module-04-bft-implementation.html |
| 2pc-flow, provision-flow | module-05-cross-shard.html |
| overview-flow-* | module-01-overview.html |
| crate-groups | module-01b-tx-flow.html, module-01c-crate-groups.html |
| file-refs-general | module-04-bft-implementation.html, module-05-cross-shard.html, module-01-overview.html, module-08-cryptography.html |
