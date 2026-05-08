(function () {
  "use strict";

  var MILESTONES = [
    { atMs: 0, phase: "ingress", announce: "WAN ingress: submits arrive at RPC fronts (Hyperscale production path)." },
    { atMs: 2700, phase: "mempool", announce: "Each tx drops into that node’s mempool view — short hop inside the card." },
    { atMs: 3350, phase: "route", announce: "Later legs: gossip / routing toward shards that declare interest — staggered per packet." },
    { atMs: 3450, phase: "shards", announce: "Arrival at a shard cluster ≈ queued for that shard’s proposer to pull from its mempool." },
  ];

  var activeRun = null;

  function phaseForElapsed(elapsedMs) {
    var phase = "idle";
    for (var i = 0; i < MILESTONES.length; i++) {
      if (elapsedMs >= MILESTONES[i].atMs) phase = MILESTONES[i].phase;
    }
    return phase;
  }

  function applyPhase(root, elapsedMs) {
    root.dataset.phase = phaseForElapsed(elapsedMs);
    var idx = -1;
    for (var i = MILESTONES.length - 1; i >= 0; i--) {
      if (elapsedMs >= MILESTONES[i].atMs) {
        idx = i;
        break;
      }
    }
    var prev = Number(root.dataset.lastMilestoneIdx || "-1");
    if (idx !== prev) {
      root.dataset.lastMilestoneIdx = String(idx);
      if (idx >= 0 && MILESTONES[idx].announce) AnimationKit.announce(root, MILESTONES[idx].announce);
    }
  }

  var scene = {
    init: function (root) {
      root.dataset.phase = "idle";
      delete root.dataset.lastMilestoneIdx;
      AnimationKit.announce(root, "Press Play — manifest + routes resolve into packet legs at runtime.");
    },

    reset: function (root) {
      if (activeRun) {
        activeRun.cancel();
        activeRun = null;
      }
      root.dataset.phase = "idle";
      delete root.dataset.lastMilestoneIdx;
      AnimationKit.announce(root, "Reset.");
    },

    play: function (root) {
      var svg = root.querySelector("[data-diagram-svg]");
      var manifest = window.Module02Manifest;
      if (!svg || !manifest || !window.ManifestPlayer) {
        AnimationKit.announce(root, "Missing SVG or ManifestPlayer.");
        return Promise.resolve();
      }

      if (AnimationKit.prefersReducedMotion()) {
        root.dataset.phase = "done";
        AnimationKit.announce(root, "Reduced motion — expand the manifest table for the timeline.");
        return Promise.resolve();
      }

      if (activeRun) {
        activeRun.cancel();
        activeRun = null;
      }
      delete root.dataset.lastMilestoneIdx;

      return new Promise(function (resolve) {
        activeRun = window.ManifestPlayer.start(svg, manifest, {
          settleMs: 500,
          onElapsed: function (ms) {
            applyPhase(root, ms);
          },
          onComplete: function () {
            root.dataset.phase = "done";
            activeRun = null;
            AnimationKit.announce(root, "Complete. Reset to replay.");
            resolve();
          },
        });
      });
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-anim-module='rpc-shards']");
    if (!root) return;
    AnimationKit.bindControls(root, scene);
  });
})();
