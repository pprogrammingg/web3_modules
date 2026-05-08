/**
 * Module 01 — two origins → RPC gateway → mempool queue.
 * Timeline is driven by SVG SMIL + lightweight JS for phase labels / HUD.
 */
(function () {
  "use strict";

  const TIMING = {
    /** Laptop ingress finishes at 0.5s + 2s = 2.5s — both txs have reached RPC */
    ingressMs: 2500,
    /** After ingress: laptop drop ends at 2.55s + 1.35s = 3.9s → 1400ms after 2.5s */
    rpcToMempoolMs: 1400,
    settleMs: 350,
  };

  /**
   * @param {number} ms
   * @returns {Promise<void>}
   */
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const scene = {
    /** @param {HTMLElement} root */
    init(root) {
      root.dataset.phase = "idle";
      const hud = root.querySelector("[data-mempool-hud]");
      if (hud) hud.textContent = "Mempool queue: 0 transactions waiting";
      AnimationKit.announce(
        root,
        "Press Play: mobile first, then laptop — two requests, two mempool entries."
      );
    },

    /** @param {HTMLElement} root */
    reset(root) {
      root.dataset.phase = "idle";
      const hud = root.querySelector("[data-mempool-hud]");
      if (hud) hud.textContent = "Mempool queue: 0 transactions waiting";
      AnimationKit.announce(root, "Reset. Ready to play again.");
      const diag = root.querySelector("[data-diagram-svg]");
      if (diag) AnimationKit.restartSvgAnimations(diag);
    },

    /** @param {HTMLElement} root */
    async play(root) {
      const hud = root.querySelector("[data-mempool-hud]");

      if (AnimationKit.prefersReducedMotion()) {
        root.dataset.phase = "done";
        if (hud) hud.textContent = "Mempool queue: 2 txs — one from mobile, one from laptop (illustrative)";
        AnimationKit.announce(
          root,
          "Reduced motion: skipping flight paths. Mobile sends first; both requests land as separate mempool entries."
        );
        return;
      }

      root.dataset.phase = "ingress";
      if (hud) hud.textContent = "Mempool queue: 0 (requests in flight to RPC)";
      AnimationKit.announce(
        root,
        "Mobile submits slightly before the laptop; both signed requests travel toward the same RPC gateway."
      );

      const diag = root.querySelector("[data-diagram-svg]");
      if (diag) AnimationKit.restartSvgAnimations(diag);

      await wait(TIMING.ingressMs);
      root.dataset.phase = "fanin";
      if (hud) hud.textContent = "RPC accepted both — forwarding each tx to the mempool…";
      AnimationKit.announce(
        root,
        "Both requests reached the RPC; each is handed down as its own job—two separate paths into the mempool."
      );

      await wait(TIMING.rpcToMempoolMs);
      root.dataset.phase = "mempool";
      if (hud)
        hud.textContent =
          "Mempool queue: 2 txs — mobile lane + laptop lane (ordering / eviction policies apply next)";
      AnimationKit.announce(
        root,
        "Two distinct transactions wait in the pool—block inclusion and finality come later."
      );

      await wait(TIMING.settleMs);
      root.dataset.phase = "done";
      AnimationKit.announce(root, "Scene complete. Press Reset, then Play to replay.");
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("[data-anim-module='rpc-mempool']");
    if (!root) return;
    AnimationKit.bindControls(root, scene);
  });
})();
