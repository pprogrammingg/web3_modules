(function () {
  "use strict";

  var MILESTONES = [
    { atMs: 0, phase: "pool", announce: "One tx T waiting in the mempool pool." },
    { atMs: 1100, phase: "propose", announce: "Proposer picks up T, then broadcasts proposal to validators." },
    { atMs: 2400, phase: "votes", announce: "Vote messages V1 and V2 travel into the QC hub together." },
    { atMs: 3500, phase: "commit", announce: "QC formed — T moves to committed block, then chain head." },
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
      AnimationKit.announce(root, "One packet T — propose and votes animated from manifest.");
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
      var manifest = window.Module03Manifest;
      if (!svg || !manifest || !window.ManifestPlayer) {
        AnimationKit.announce(root, "Missing SVG or manifest.");
        return Promise.resolve();
      }

      if (AnimationKit.prefersReducedMotion()) {
        root.dataset.phase = "done";
        AnimationKit.announce(root, "Reduced motion — read the manifest table.");
        return Promise.resolve();
      }

      if (activeRun) {
        activeRun.cancel();
        activeRun = null;
      }
      delete root.dataset.lastMilestoneIdx;

      return new Promise(function (resolve) {
        activeRun = window.ManifestPlayer.start(svg, manifest, {
          dotRadius: 9,
          settleMs: 500,
          onElapsed: function (ms) {
            applyPhase(root, ms);
          },
          onComplete: function () {
            root.dataset.phase = "done";
            activeRun = null;
            AnimationKit.announce(root, "Done.");
            resolve();
          },
        });
      });
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-anim-module='shard-bft']");
    if (!root) return;
    AnimationKit.bindControls(root, scene);
  });
})();
