# Testing this repo

Static HTML/CSS/JS only — there is no bundler or browser test runner in CI. All checks are **Node filesystem + string contracts** so they run anywhere Node runs.

## Run everything (recommended)

From the **repository root**:

```bash
./tests/run-all.sh
```

Or the legacy entry point (same behavior):

```bash
./test-all.sh
```

## Order of checks (important)

Steps are **ordered on purpose**: cheap failures first, then broader HTML contracts.

| Step | Command | What it proves |
|------|---------|----------------|
| 1 | `node verify-paths.js` | Every module path in course data files exists; CSS/JS paths on those pages resolve; internal `.html` links work. |
| 2 | `node scripts/sanity-pages.js` | Landing + hubs load local assets; external `https` links use `target="_blank"` + `noopener`; all listed modules + `solana-core/**` + `zk/**` + `evm/**` HTML pass the same asset/link rules. |
| 3 | `node tests/js-syntax-check.js` | Shared scripts parse under `node --check` (catches syntax errors before you open a browser). |
| 3b | `node tests/hub-href-contract.js` | Hub module cards use **track-relative** `href`s (no `evm/evm/...` from `/evm/index.html`). |
| 4 | `node tests/render-contracts.js` | **Layout contract**: root picker + each track hub contains expected skeleton (`container`, styles link id, key section markers). Catches deleted wrappers / renamed IDs. |
| 4b | `node tests/module-page-contract.js` | **Module shell**: every curriculum HTML file uses `course-content`, `main-styles`, `ensure-styles.js`, track `body` class, `module-init.js` (where applicable), and no deprecated footnote/nav inline styles. See `common/MODULE_PAGE.md`. |
| 4c | `node tests/hyperscale-reflect-contract.js` | **Hyperscale-rs sync**: clone HEAD matches `hyperscale-rs-last-synced.txt`, all `FILE_REFS` exist, no stale `bft`/`io_loop` paths in hyperscale HTML. See `common/HYPERSCALE_FLOW_README.md`. |
| 4d | `node tests/mobile-contract.js` | **Mobile**: viewport meta on all layout pages (dynamic list from course-data + hubs); `flow-steps` tables in `.table-wrap`; required `@media (max-width: 640px)` rules in `styles.css`. |
| 4e | `node tests/module-surface-contract.js` | **Reading surface**: `.course-content .section` transparent; module `th`/`td` white override **after** global `th { bg2 }` in file order; EVM hero blend contained. Catches grey/white patchwork that 4b/4d do not. |
| 5 | `node tests/test-quiz.js` | Quiz feedback CSS/JS markers still present (`incorrect`, `question-wrong`). |

## What automated tests cannot do

They do **not** render pages in a browser. A regex “override exists somewhere in styles.css” is not enough — `module-surface-contract` (4e) checks **order and section backgrounds** because that is what caused visible grey/white stripes on EVM modules.

## When to run which

- **After editing `common/styles.css`:** `./tests/run-all.sh` (especially step **4e**)
- **After editing any module HTML, hub, or `common/*.js`:** `./tests/run-all.sh`
- **After pulling hyperscale-rs or editing `hyperscale-flow-data.js`:** `node scripts/reflect-changes.js hyperscale` then `node tests/hyperscale-reflect-contract.js` (included in `run-all.sh` step **4c**); see **`common/HYPERSCALE_FLOW_README.md`**
- **Before adding a module:** read `common/MODULE_PAGE.md`; run `node scripts/normalize-module-pages.js` if you copied legacy markup
- **After only changing course copy inside existing `course-data` paths:** `node verify-paths.js` is often enough
- **After landing page, glossary, or external links:** `node scripts/sanity-pages.js`
- **After touching hub navigation or `module.path` conventions:** `node tests/hub-href-contract.js`
- **After touching `navigation.js` or quiz styles:** `node tests/test-quiz.js`

## Manual rendering (browser)

Automated checks do **not** paint pixels in a browser. For a quick visual pass:

1. `python3 -m http.server 8000` from the repo root  
2. Open **`http://localhost:8000/mobile-test.html`** — buttons, nav stack, module grid, segment table (resize to ~375px width).  
3. Spot-check one real module per track (same narrow width).  

Page lists for contracts are built dynamically from `common/*-course-data.js` — no per-module test maintenance when you add a module path there.

## Adding a new track or hub

1. Register paths in `verify-paths.js` / `scripts/sanity-pages.js` as required for that tree.  
2. Add the hub path + **track-specific checks** in `tests/render-contracts.js` (`HUB_EXTRA` / hub loop) so the contract test fails fast if the hub skeleton breaks.
