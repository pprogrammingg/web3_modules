#!/usr/bin/env node
/**
 * Static consistency check for SVG SMIL + scene.js TIMING (no browser).
 * Run from repo root: node animations/scripts/check-animation-consistency.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function read(p) {
  return fs.readFileSync(p, "utf8");
}

/** @param {string} s */
function parseTimeToMs(s) {
  if (s == null || s === "") return 0;
  const t = String(s).trim();
  if (t.endsWith("ms")) return parseFloat(t);
  if (t.endsWith("s")) return parseFloat(t) * 1000;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : 0;
}

/** @param {string} html */
function collectIds(html) {
  const ids = new Set();
  const re = /\bid="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(m[1]);
  return ids;
}

/** @param {string} html */
function validateHrefTargets(html) {
  const ids = collectIds(html);
  const refs = new Map();
  const re = /(?:href|xlink:href)="#([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    refs.set(id, (refs.get(id) || 0) + 1);
  }
  const missing = [];
  for (const id of refs.keys()) {
    if (!ids.has(id)) missing.push(id);
  }
  return { ids, refs: Object.fromEntries(refs), missing };
}

/** @param {string} html */
function parseAnimateMotionsInOrder(html) {
  const svgStart = html.indexOf("<svg");
  const svgSlice = svgStart >= 0 ? html.slice(svgStart) : html;
  const motions = [];
  const re = /<animateMotion\s+([^>]+)>/gi;
  let match;
  while ((match = re.exec(svgSlice)) !== null) {
    const attrs = match[1];
    const dur = attrs.match(/\bdur="([^"]+)"/)?.[1] ?? "0s";
    const begin = attrs.match(/\bbegin="([^"]*)"/)?.[1] ?? "0s";
    motions.push({
      beginMs: parseTimeToMs(begin),
      durMs: parseTimeToMs(dur),
      endMs: parseTimeToMs(begin) + parseTimeToMs(dur),
    });
  }
  return motions;
}

/** @param {string} js */
function parseTimingObject(js) {
  const block = js.match(/const\s+TIMING\s*=\s*\{([^}]*)\}/s);
  if (!block) return null;
  const inner = block[1];
  const ingressMs = Number(inner.match(/ingressMs:\s*(\d+)/)?.[1]);
  const rpcToMempoolMs = Number(inner.match(/rpcToMempoolMs:\s*(\d+)/)?.[1]);
  if (!Number.isFinite(ingressMs) || !Number.isFinite(rpcToMempoolMs)) return null;
  return { ingressMs, rpcToMempoolMs };
}

function checkModule01() {
  const name = "module-01-rpc-mempool";
  const dir = path.join(ROOT, name);
  const htmlPath = path.join(dir, "index.html");
  const scenePath = path.join(dir, "scene.js");

  const html = read(htmlPath);
  const scene = read(scenePath);
  const timing = parseTimingObject(scene);

  const { missing } = validateHrefTargets(html);
  const motions = parseAnimateMotionsInOrder(html);

  const errors = [];
  const warnings = [];

  if (missing.length) {
    errors.push(`Broken href targets (no matching id): ${missing.join(", ")}`);
  }

  if (!timing) {
    errors.push("Could not parse TIMING { ingressMs, rpcToMempoolMs } from scene.js");
  }

  if (motions.length < 4) {
    errors.push(`Expected at least 4 <animateMotion> elements in SVG, found ${motions.length}`);
  }

  if (timing && motions.length >= 4) {
    const ingressMotions = motions.slice(0, 2);
    const egressMotions = motions.slice(2);
    const ingressEnd = Math.max(...ingressMotions.map((x) => x.endMs));
    const globalEnd = Math.max(...motions.map((x) => x.endMs));
    const expectedRpcGap = Math.round(globalEnd - ingressEnd);

    if (timing.ingressMs !== Math.round(ingressEnd)) {
      errors.push(
        `TIMING.ingressMs (${timing.ingressMs}) !== SVG ingress end (${Math.round(ingressEnd)} ms). Update scene.js or SVG.`
      );
    }
    if (timing.rpcToMempoolMs !== expectedRpcGap) {
      errors.push(
        `TIMING.rpcToMempoolMs (${timing.rpcToMempoolMs}) !== last_motion_end - ingress_end (${expectedRpcGap}). Update scene.js or SVG.`
      );
    }
  }

  return {
    name,
    errors,
    warnings,
    detail: timing
      ? {
          motions: motions.map((m) => ({
            beginMs: Math.round(m.beginMs),
            durMs: Math.round(m.durMs),
            endMs: Math.round(m.endMs),
          })),
          timing,
        }
      : { motions },
  };
}

function main() {
  console.log("Animation consistency check\n");
  const r = checkModule01();

  if (r.detail.motions) {
    console.log(`[${r.name}] animateMotion timeline (ms):`);
    r.detail.motions.forEach((row, i) => {
      console.log(`  ${i + 1}. begin ${row.beginMs}  dur ${row.durMs}  end ${row.endMs}`);
    });
    if (r.detail.timing) {
      console.log(`  scene TIMING: ingressMs=${r.detail.timing.ingressMs}, rpcToMempoolMs=${r.detail.timing.rpcToMempoolMs}`);
    }
  }

  for (const w of r.warnings) console.warn(`⚠ ${w}`);
  for (const e of r.errors) console.error(`✗ ${e}`);

  if (r.errors.length) {
    console.error(`\nFailed: ${r.errors.length} error(s).`);
    process.exit(1);
  }
  console.log("\n✓ module-01 SMIL ↔ scene.js timings and href targets OK.\n");
}

main();
