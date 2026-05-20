# Module page shell (all tracks)

Curriculum modules are static HTML. **Do not fork per-track CSS** for layout — use `common/styles.css` and the patterns below.

## Required shell

Every **curriculum module** (paths in `common/*-course-data.js`, plus `solana-core/**/module-*.html`) should match this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>…</title>
    <link rel="stylesheet" href="../../common/styles.css" id="main-styles">
    <script src="../../common/ensure-styles.js"></script>
</head>
<body class="zk-track"><!-- or crypto-track | evm-track; hyperscale may omit track class -->
    <nav class="site-home-bar">
        <a href="../index.html" class="site-home-link">← Track home</a>
        <a href="../../index.html" class="site-home-link">All tracks</a>
    </nav>
    <div class="course-content container">
        <div class="course-header"><!-- optional: evm-polished-hero polished-stone-surface -->
            <h1>…</h1>
            <p class="course-header-lede">…</p><!-- optional subtitle -->
            <div class="course-meta">…</div>
        </div>

        <div class="section">
            <h2>Reading segments (~20–25 min each)</h2>
            <div class="table-wrap">
                <table class="flow-steps">…</table>
            </div>
            <p class="module-footnote">Pause between segments…</p>
        </div>

        <div class="section section-tight module-tight-prose">
            <h2>Segment 1 — …</h2>
            …
        </div>

        <div class="module-actions">
            <button type="button" class="btn btn-primary" id="complete-module-btn">Mark module complete</button>
        </div>
        <nav class="navigation module-nav">…</nav>
    </div>
    <!-- Track scripts — see table below -->
    <script src="../../common/module-init.js" data-module-id="…"></script>
</body>
</html>
```

`node tests/module-page-contract.js` enforces this on every module in course data (and Solana HTML).

## Script bundles by track

| Track | `body` class | Scripts (after `navigation.js` + `glossary.js`) |
|-------|----------------|--------------------------------------------------|
| Hyperscale | (none) | `course-data.js`, `protocol-engineer-track.js`, `module-init.js` |
| ZK | `zk-track` | `zk-course-data.js`, `zk-navigation.js`, `module-init.js` |
| Crypto | `crypto-track` | `crypto-course-data.js`, `crypto-navigation.js`, `module-init.js` |
| EVM | `evm-track` | `evm-course-data.js`, `evm-navigation.js`, `module-init.js` |
| Solana | (scaffold) | `glossary.js` only until `solana-course-data` + init exist |

`module-init.js` picks the track initializer from `data-module-id` (`zk-l*`, `crypto-*`, `evm-l*`, else Hyperscale `initializeModulePage`).

## CSS classes (prefer over `style=""`)

| Class | Use |
|-------|-----|
| `course-content` | White module card on grey page background |
| `section` | Bordered segment block (tables + prose) |
| `section-tight` | Less top margin between consecutive segments |
| `module-tight-prose` | Tighter paragraph spacing in long segments |
| `table-wrap` + `flow-steps` | Segment syllabus table |
| `module-footnote` | Muted helper line under segment table |
| `module-footnote--tight` | Footnote with `margin-bottom: 0` |
| `course-header-lede` | Hero subtitle (EVM polished hero tints text) |
| `module-nav` | Prev/next footer spacing |
| `module-actions` | Complete button row |

**Tables:** `.course-content .section` and `.course-content .table-wrap` force `th`/`td` to `--bg` so global `th { background: var(--bg2) }` does not create grey/white row stripes.

## Adding a new module

1. Add entry to the track’s `common/*-course-data.js` (`id`, `path`, …).
2. Copy an existing module HTML from the same track; keep the shell.
3. Add `id` to `AVAILABLE_*_MODULES` in the matching `*-navigation.js`.
4. Run `bash tests/run-all.sh` from repo root (includes **module-surface-contract** — catches grey/white CSS regressions).

## Mobile

- Every page needs `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Wrap wide tables in `<div class="table-wrap"><table class="flow-steps">…</table></div>` — horizontal scroll on phones is defined once in `styles.css`.
- Do not add per-track mobile CSS; extend the `@media (max-width: 640px)` block in `common/styles.css`.
- Manual checklist: `mobile-test.html` at repo root.

## Normalizing legacy inline styles

```bash
node scripts/normalize-module-pages.js
```

Replaces deprecated footnote/nav inline patterns with the classes above (ZK/Crypto/EVM segment modules).
