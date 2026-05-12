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
| 5 | `node tests/test-quiz.js` | Quiz feedback CSS/JS markers still present (`incorrect`, `question-wrong`). |

## When to run which

- **After editing any module HTML, hub, or `common/*.js`:** `./tests/run-all.sh`
- **After only changing course copy inside existing `course-data` paths:** `node verify-paths.js` is often enough
- **After landing page, glossary, or external links:** `node scripts/sanity-pages.js`
- **After touching hub navigation or `module.path` conventions:** `node tests/hub-href-contract.js`
- **After touching `navigation.js` or quiz styles:** `node tests/test-quiz.js`

## Manual rendering (browser)

Automated checks do **not** execute layout or JS in a real browser. For visual regressions:

1. `python3 -m http.server 8000` from the repo root  
2. Open `http://localhost:8000/index.html` and spot-check **Hyperscale**, **Solana**, **Cryptography**, **ZK**, and **EVM** hubs plus one module per track.  
3. Optional: open `test-modules.html` at the repo root for a small card/navigation layout scratch page.

## Adding a new track or hub

1. Register paths in `verify-paths.js` / `scripts/sanity-pages.js` as required for that tree.  
2. Add the hub path + **track-specific checks** in `tests/render-contracts.js` (`HUB_EXTRA` / hub loop) so the contract test fails fast if the hub skeleton breaks.
