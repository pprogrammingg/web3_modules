# Web3 protocol modules

Static HTML/CSS/JS courses: open **`index.html`** for the track picker (**Hyperscale** vs **Solana Core**). Shared assets and glossary live under **`common/`**; Hyperscale modules under **`hyperscale/`**; Solana reading segments under **`solana-core/`**.

## Build and open the project

**There is no build step.** This is a static site (HTML, CSS, JS). No Node build script or `scripts/build-data.js` is required.

**To open locally:**

1. **Option A – Direct file:**  
   Open `index.html` in your browser (e.g. double‑click, or drag into the browser window).

2. **Option B – Local server (recommended if links behave oddly):**  
   From the project root (`/Users/chemipoo/wip/web3_modules` or wherever you cloned it), run:
   ```bash
   # Python 3
   python3 -m http.server 8000
   # or
   npx serve
   ```
   Then visit **http://localhost:8000** (or the port shown) and open `index.html`.

**To run checks (optional):**
```bash
node verify-paths.js       # Module paths vs course-data
node scripts/sanity-pages.js   # Landing cards, hubs, local CSS/JS, external links
./test-all.sh              # Includes both above plus quiz/CSS/JS smoke checks
```

## Quick Start

1. Open `index.html` in your browser (or via a local server as above).
2. Choose **Hyperscale** or **Solana Core**.
3. For Hyperscale: start at Level 1 and follow module cards; complete read → quiz → assignment → mark complete where applicable.

## Structure

- **`common/`** — Styles, course data, navigation, glossary, hyperscale flow/link helpers
- **`hyperscale/`** — `basic/`, `intermediate/`, `advanced/`, `hyperscale-rs/` modules + `hyperscale/index.html` (full journey)
- **`solana-core/`** — Parallel track (levels, reading segments); glossary links point at `common/glossary.html`
- **`animations/`** — Diagram experiments (uses `../common/styles.css` plus local `animations/shared/` JS)

## Deploy (GitHub Pages)

The site deploys from the `main` branch (Settings → Pages → “Deploy from a branch”). If **Home** or **Back to Index** don’t work or look wrong after deploy:

1. **Confirm the latest code is on `main`**  
   On GitHub: repo → **Code** → open `index.html` and check that your changes are there. If not, push your latest commit.

2. **Bypass cache**  
   Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac). Or open the site in a private/incognito window.

## Testing

```bash
node verify-paths.js  # Verify all paths
open test-modules.html  # Browser tests
./test-all.sh  # Run all tests
```

See [TESTING.md](TESTING.md) for details.