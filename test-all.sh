#!/usr/bin/env bash
# Back-compat wrapper — canonical suite lives in tests/run-all.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
exec bash "$ROOT/tests/run-all.sh"
