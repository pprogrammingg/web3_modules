#!/usr/bin/env bash
# Canonical test runner — run from repo root: ./tests/run-all.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== 1. verify-paths (module files + link targets) =="
node verify-paths.js

echo ""
echo "== 2. sanity-pages (hubs, assets, external link policy) =="
node scripts/sanity-pages.js

echo ""
echo "== 3. js-syntax-check (node --check on shared scripts) =="
node tests/js-syntax-check.js

echo ""
echo "== 3b. hub-href-contract (track hub links not doubled) =="
node tests/hub-href-contract.js

echo ""
echo "== 4. render-contracts (HTML skeleton markers) =="
node tests/render-contracts.js

echo ""
echo "== 4b. module-page-contract (curriculum module shell + no deprecated inline) =="
node tests/module-page-contract.js

echo ""
echo "== 4c. mobile-contract (viewport, table-wrap, shared CSS mobile rules) =="
node tests/mobile-contract.js

echo ""
echo "== 4d. module-surface-contract (CSS cascade: no grey/white module patchwork) =="
node tests/module-surface-contract.js

echo ""
echo "== 5. quiz highlight contract =="
node tests/test-quiz.js

echo ""
echo "== 5b. glossary contract (expand link + anchor ids) =="
node tests/glossary-contract.js

echo ""
echo "== 6. mobile-test page present =="
test -f mobile-test.html
grep -q 'common/styles.css' mobile-test.html
grep -q 'module-grid\|module-card' mobile-test.html

echo ""
echo "✅ All test stages passed."
