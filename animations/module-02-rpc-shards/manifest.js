/**
 * Module 02 — Hyperscale-aligned timeline (schematic times).
 *
 * Ground truth (basic_hyperscale.md, TX_FLOW_STEPS, module-01b): submit → node → per-shard mempools →
 * gossip / routing → on each shard the round-robin proposer runs try_propose and pulls ready txs from
 * *that shard’s* mempool into a candidate block — not from the RPC ingress node directly.
 *
 * Where does the block “end up”?
 * — Inside the shard only at first: the proposer broadcasts the proposal (header / block) to other
 *   validators on *that same shard*; they vote; a QC forms; the block commits onto *that shard’s*
 *   chain. Other shards do not receive “the same block” as a blob — they have their own proposers
 *   and chains. Cross-shard work uses provisions / execution phases later (not drawn here).
 *
 * What this manifest draws:
 *   user → RPC → local mempool hop → dashed leg toward a shard cluster.
 * The dashed leg stands for “tx is available on that shard (mempool there) and can be picked up.”
 * It does *not* yet separate proposer selection vs BuildProposal vs votes — that would be extra legs,
 * e.g. future rows + SVG routes:
 *     shard-alpha/mempool → proposer-build → proposal-gossip → qc → committed-head  (all intra-shard).
 */
(function (global) {
  "use strict";

  global.Module02Manifest = {
    packetColors: {
      A: "#2563eb",
      B: "#10b981",
      C: "#f59e0b",
    },

    routes: {
      "user-a|rpc-west": "path-user-a-rpcw",
      "user-b|rpc-west": "path-user-b-rpcw",
      "user-c|rpc-east": "path-user-c-rpce",

      "rpc-west|mempool-west": "path-rpcw-mempool",
      "rpc-east|mempool-east": "path-rpce-mempool",

      "mempool-west|shard-alpha": "path-mempoolw-shard-a",
      "mempool-west|shard-beta": "path-mempoolw-shard-b",
      "mempool-east|shard-gamma": "path-mempoole-shard-c",
    },

    /**
     * Sorted by tMs when played. Durations are illustrative only.
     * Ingress finishes → short mempool hop → shard leg starts (different tMs per packet).
     */
    events: [
      { tMs: 0, durMs: 2800, packet: "A", from: "user-a", to: "rpc-west" },
      { tMs: 2800, durMs: 450, packet: "A", from: "rpc-west", to: "mempool-west" },
      { tMs: 3400, durMs: 3600, packet: "A", from: "mempool-west", to: "shard-alpha" },

      { tMs: 400, durMs: 2800, packet: "B", from: "user-b", to: "rpc-west" },
      { tMs: 3200, durMs: 450, packet: "B", from: "rpc-west", to: "mempool-west" },
      { tMs: 3850, durMs: 3600, packet: "B", from: "mempool-west", to: "shard-beta" },

      { tMs: 250, durMs: 3000, packet: "C", from: "user-c", to: "rpc-east" },
      { tMs: 3250, durMs: 450, packet: "C", from: "rpc-east", to: "mempool-east" },
      { tMs: 3880, durMs: 3800, packet: "C", from: "mempool-east", to: "shard-gamma" },
    ],
  };
})(typeof window !== "undefined" ? window : globalThis);
