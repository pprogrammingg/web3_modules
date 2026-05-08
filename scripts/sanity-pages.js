#!/usr/bin/env node
/**
 * Light sanity checks for static HTML “rendering”: landing cards, track hubs,
 * sample modules, local CSS/JS reachable, external links open in a new tab safely.
 *
 * Uses the filesystem only (no browser, no HTTP server). Run from repo root:
 *   node scripts/sanity-pages.js
 *
 * See .cursor/rules/page-sanity.mdc for when to run this while editing layouts/links.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

let errors = [];
let warnings = [];

function fail(msg) {
    errors.push(msg);
    console.error('  ❌', msg);
}

function warn(msg) {
    warnings.push(msg);
    console.warn('  ⚠️ ', msg);
}

function ok(msg) {
    console.log('  ✅', msg);
}

function readUtf8(rel) {
    const p = path.join(REPO_ROOT, rel);
    return fs.readFileSync(p, 'utf8');
}

function fileExists(rel) {
    return fs.existsSync(path.join(REPO_ROOT, rel));
}

/** Resolve href relative to the HTML file's directory. */
function resolveFromHtml(htmlRel, href) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
        return null;
    }
    if (/^https?:\/\//i.test(href)) return null;
    const base = path.dirname(htmlRel);
    const normalized = path.normalize(path.join(base, href.split('#')[0].split('?')[0]));
    if (normalized.startsWith('..')) return null;
    return normalized.split(path.sep).join('/');
}

/** Collect local stylesheet + script src from raw HTML. */
function localAssetRefs(htmlRel, html) {
    const refs = [];
    const linkRe = /<link\b[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
        const tag = m[0];
        const hm = /href\s*=\s*["']([^"']+)["']/i.exec(tag);
        if (hm) refs.push({ type: 'css', raw: hm[1] });
    }
    const scriptRe = /<script\b[^>]*>/gi;
    while ((m = scriptRe.exec(html)) !== null) {
        const tag = m[0];
        if (/type\s*=\s*["']module["']/i.test(tag)) continue;
        const sm = /src\s*=\s*["']([^"']+)["']/i.exec(tag);
        if (sm) refs.push({ type: 'js', raw: sm[1] });
    }
    return refs.map(r => {
        const rel = resolveFromHtml(htmlRel, r.raw);
        return rel ? { ...r, rel } : null;
    }).filter(Boolean);
}

function verifyLocalAssets(htmlRel) {
    const full = path.join(REPO_ROOT, htmlRel);
    if (!fs.existsSync(full)) {
        fail(`Missing HTML: ${htmlRel}`);
        return;
    }
    const html = fs.readFileSync(full, 'utf8');
    const refs = localAssetRefs(htmlRel, html);
    for (const r of refs) {
        const ap = path.join(REPO_ROOT, r.rel);
        if (!fs.existsSync(ap)) {
            fail(`${htmlRel}: asset missing → ${r.rel} (${r.type}, from ${r.raw})`);
            continue;
        }
        const st = fs.statSync(ap);
        if (st.size === 0) {
            warn(`${htmlRel}: empty file → ${r.rel}`);
        }
    }
    if (refs.length === 0) {
        warn(`${htmlRel}: no local CSS/JS refs found (unexpected for course pages)`);
    }
}

/** External https links must use target=_blank and rel including noopener. */
function verifyExternalAnchors(htmlRel) {
    const html = readUtf8(htmlRel);
    const re = /<a\b([^>]*)>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        const attrs = m[1];
        const hrefM = /href\s*=\s*["'](https?:\/\/[^"']+)["']/i.exec(attrs);
        if (!hrefM) continue;
        const hasBlank = /\btarget\s*=\s*["']_blank["']/i.test(attrs);
        const relVal = /\brel\s*=\s*["']([^"']*)["']/i.exec(attrs);
        const rel = relVal ? relVal[1] : '';
        const hasNoopener = /\bnoopener\b/i.test(rel);
        if (!hasBlank || !hasNoopener) {
            fail(
                `${htmlRel}: external link must use target="_blank" and rel including noopener → ${hrefM[1]}`
            );
        }
    }
}

function loadCourseModulePaths() {
    const courseDataPath = path.join(REPO_ROOT, 'common', 'course-data.js');
    const content = fs.readFileSync(courseDataPath, 'utf8');
    const regex = /path:\s*'([^']+\.html)'/g;
    const out = [];
    let x;
    while ((x = regex.exec(content)) !== null) {
        out.push(x[1]);
    }
    return [...new Set(out)];
}

function walkHtmlFiles(dirRel) {
    const out = [];
    const abs = path.join(REPO_ROOT, dirRel);
    if (!fs.existsSync(abs)) return out;
    const entries = fs.readdirSync(abs, { withFileTypes: true });
    for (const e of entries) {
        const rel = path.join(dirRel, e.name).split(path.sep).join('/');
        if (e.isDirectory()) {
            out.push(...walkHtmlFiles(rel));
        } else if (e.isFile() && e.name.endsWith('.html')) {
            out.push(rel);
        }
    }
    return out;
}

function assertLandingPage() {
    const html = readUtf8('index.html');
    if (!html.includes('track-grid')) fail('index.html: missing .track-grid');
    if (!html.includes('track-card--hyperscale')) fail('index.html: missing Hyperscale card');
    if (!html.includes('track-card--solana')) fail('index.html: missing Solana card');
    if (!html.includes('href="hyperscale/index.html"')) fail('index.html: missing Hyperscale card href');
    if (!html.includes('href="solana-core/index.html"')) fail('index.html: missing Solana card href');
    if (!html.includes('href="common/glossary.html"')) fail('index.html: missing glossary footer link');
    else ok('Landing: two track cards + glossary link present');
}

function main() {
    console.log('Sanity: landing, hubs, modules, assets, external links\n');

    assertLandingPage();

    const hubs = ['hyperscale/index.html', 'solana-core/index.html', 'common/glossary.html', 'animations/index.html'];
    for (const h of hubs) {
        verifyLocalAssets(h);
        verifyExternalAnchors(h);
        ok(`Hub assets + external links: ${h}`);
    }

    const modulePaths = loadCourseModulePaths();
    let checked = 0;
    for (const mp of modulePaths) {
        verifyLocalAssets(mp);
        verifyExternalAnchors(mp);
        checked++;
    }
    ok(`Hyperscale modules from course-data (${checked} files)`);

    const solanaPages = walkHtmlFiles('solana-core');
    for (const sp of solanaPages) {
        verifyLocalAssets(sp);
        verifyExternalAnchors(sp);
    }
    ok(`Solana Core HTML (${solanaPages.length} files)`);

    console.log('\n' + '='.repeat(56));
    if (errors.length) {
        console.error(`FAILED — ${errors.length} error(s), ${warnings.length} warning(s)`);
        process.exit(1);
    }
    if (warnings.length) {
        console.warn(`OK with ${warnings.length} warning(s)`);
        process.exit(0);
    }
    console.log('OK — sanity pages passed');
    process.exit(0);
}

main();
