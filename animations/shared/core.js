/**
 * AnimationKit — shared helpers for HTML5 animation modules (no build step).
 * Pattern: each module registers a scene with play()/reset() and optional timeline.
 */
(function (global) {
  "use strict";

  /**
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * @param {HTMLElement} root
   * @param {(chain: { next: () => void }) => void} fn receives control to advance steps
   */
  function runSequence(root, fn) {
    const chain = {
      next() {
        root.dataset.sequenceBusy = "false";
      },
    };
    root.dataset.sequenceBusy = "true";
    try {
      fn(chain);
    } catch (e) {
      root.dataset.sequenceBusy = "false";
      throw e;
    }
  }

  /**
   * Wire play / reset buttons. Scene API: { play(root), reset(root), init?(root) }
   * @param {HTMLElement} root
   * @param {{ play: Function, reset: Function, init?: Function }} scene
   */
  function bindControls(root, scene) {
    const playBtn = root.querySelector("[data-action='play']");
    const resetBtn = root.querySelector("[data-action='reset']");

    if (typeof scene.init === "function") {
      scene.init(root);
    }

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (root.dataset.sequenceBusy === "true") return;
        root.dataset.playing = "true";
        Promise.resolve(scene.play(root)).finally(() => {
          root.dataset.playing = "false";
        });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        root.dataset.playing = "false";
        scene.reset(root);
      });
    }
  }

  /**
   * Restart every SVG SMIL animation under root (animate, animateMotion, animateTransform).
   * @param {HTMLElement} root
   */
  function restartSvgAnimations(root) {
    const els = root.querySelectorAll("animate, animateMotion, animateTransform");
    els.forEach((el) => {
      try {
        el.beginElement();
      } catch (_e) {
        /* ignore */
      }
    });
  }

  /**
   * Pause SMIL animations (best-effort).
   * @param {HTMLElement} root
   */
  function pauseSvgAnimations(root) {
    const els = root.querySelectorAll("animate, animateMotion, animateTransform");
    els.forEach((el) => {
      try {
        el.endElement();
      } catch (_e) {
        /* ignore */
      }
    });
  }

  /**
   * Set accessible live region text.
   * @param {HTMLElement} root
   * @param {string} message
   */
  function announce(root, message) {
    const live = root.querySelector("[data-live]");
    if (live) live.textContent = message;
  }

  const AnimationKit = {
    prefersReducedMotion,
    runSequence,
    bindControls,
    restartSvgAnimations,
    pauseSvgAnimations,
    announce,
  };

  global.AnimationKit = AnimationKit;
})(typeof window !== "undefined" ? window : globalThis);
