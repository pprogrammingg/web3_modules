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
echo "== 5. quiz highlight contract =="
node tests/test-quiz.js

echo ""
echo "== 6. mobile-test page present =="
test -f mobile-test.html
grep -q 'common/styles.css' mobile-test.html
grep -q 'module-grid\|module-card' mobile-test.html

echo ""
echo "✅ All test stages passed."
