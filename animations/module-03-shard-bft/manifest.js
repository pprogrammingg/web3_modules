/**
 * Module 03 — one mempool tx (T) + animated votes (V1, V2) into QC, then commit + chain.
 * Vote legs use smaller dotRadius (see manifest-player optional per-event radius).
 */
(function (global) {
  "use strict";

  global.Module03Manifest = {
    packetColors: {
      T: "#2563eb",
      V1: "#7c3aed",
      V2: "#a855f7",
    },

    routes: {
      "mempool-pool|proposer-node": "path-mempool-proposer",
      "proposer-node|validators-center": "path-proposer-validators",
      "validator-left|qc-hub": "path-vote-left-qc",
      "validator-right|qc-hub": "path-vote-right-qc",
      "qc-hub|committed-block": "path-qc-committed",
      "committed-block|chain-head": "path-committed-chain",
    },

    /**
     * Single tx T through propose; parallel vote messages; then QC → committed → chain.
     */
    events: [
      { tMs: 0, durMs: 1100, packet: "T", from: "mempool-pool", to: "proposer-node" },
      { tMs: 1300, durMs: 1000, packet: "T", from: "proposer-node", to: "validators-center" },
      { tMs: 2500, durMs: 900, packet: "V1", from: "validator-left", to: "qc-hub", dotRadius: 6 },
      { tMs: 2500, durMs: 900, packet: "V2", from: "validator-right", to: "qc-hub", dotRadius: 6 },
      { tMs: 3600, durMs: 900, packet: "T", from: "qc-hub", to: "committed-block" },
      { tMs: 4700, durMs: 800, packet: "T", from: "committed-block", to: "chain-head" },
    ],
  };
})(typeof window !== "undefined" ? window : globalThis);
