/**
 * Manifest → resolve legs → render (rAF keyframes). Static SVG topology is untouched.
 * Play/restart: call start() again — legs are re-resolved from manifest + routes each time.
 */
(function (global) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  function routeKey(from, to) {
    return from + "|" + to;
  }

  /**
   * @param {{ pathId?: string, from: string, to: string }} ev
   * @param {Record<string, string>} routes from|to → path id
   */
  function resolvePathId(ev, routes) {
    if (ev.pathId) return ev.pathId;
    if (!routes) return null;
    return routes[routeKey(ev.from, ev.to)] || null;
  }

  /**
   * @param {SVGSVGElement} svg
   * @param {{ events: object[], routes?: Record<string, string>, packetColors?: Record<string, string> }} manifest
   * @returns {{ path: SVGPathElement, t0: number, dur: number, packet: string, from: string, to: string }[]}
   */
  function prepareLegs(svg, manifest) {
    var routes = manifest.routes || {};
    var sorted = manifest.events.slice().sort(function (a, b) {
      return a.tMs - b.tMs;
    });
    var out = [];
    sorted.forEach(function (ev) {
      var pid = resolvePathId(ev, routes);
      if (!pid) {
        console.warn("[manifest-player] no path for", ev.from, "→", ev.to);
        return;
      }
      var path = svg.querySelector("#" + pid);
      if (!path || path.tagName !== "path") {
        console.warn("[manifest-player] missing <path id=\"" + pid + "\">");
        return;
      }
      out.push({
        path: path,
        t0: ev.tMs,
        dur: ev.durMs != null ? ev.durMs : 2400,
        packet: ev.packet,
        from: ev.from,
        to: ev.to,
        dotRadius: ev.dotRadius,
      });
    });
    return out;
  }

  /**
   * @param {SVGSVGElement} svg
   * @param {{ events: object[], routes?: Record<string, string>, packetColors?: Record<string, string> }} manifest
   * @param {{ settleMs?: number, dotRadius?: number, onElapsed?: function(number), onComplete?: function() }} opts
   */
  function start(svg, manifest, opts) {
    opts = opts || {};
    var legs = prepareLegs(svg, manifest);
    var packetColors = manifest.packetColors || {};
    var dotRadius = opts.dotRadius != null ? opts.dotRadius : 9;
    var settleMs = opts.settleMs != null ? opts.settleMs : 400;

    var totalMs = settleMs;
    legs.forEach(function (leg) {
      var end = leg.t0 + leg.dur;
      if (end > totalMs) totalMs = end;
    });

    var layer = svg.querySelector("[data-packet-layer]");
    if (!layer) layer = svg;

    var state = [];
    legs.forEach(function (leg) {
      var r = leg.dotRadius != null ? leg.dotRadius : dotRadius;
      var c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("r", String(r));
      c.setAttribute("fill", packetColors[leg.packet] || "#64748b");
      c.setAttribute("opacity", "0");
      c.classList.add("manifest-packet");
      if (r < 8) c.classList.add("manifest-packet--small");
      c.setAttribute("data-packet", leg.packet);
      c.setAttribute("data-from", leg.from);
      c.setAttribute("data-to", leg.to);
      layer.appendChild(c);
      state.push({ el: c, path: leg.path, t0: leg.t0, dur: leg.dur });
    });

    var startWall = null;
    var rafId = null;

    function tick(now) {
      if (startWall === null) startWall = now;
      var elapsed = now - startWall;
      if (opts.onElapsed) opts.onElapsed(elapsed);

      state.forEach(function (s) {
        var len = s.path.getTotalLength();
        var tRel = elapsed - s.t0;
        if (tRel < 0) {
          s.el.setAttribute("opacity", "0");
          return;
        }
        if (tRel >= s.dur) {
          var pEnd = s.path.getPointAtLength(len);
          s.el.setAttribute("cx", String(pEnd.x));
          s.el.setAttribute("cy", String(pEnd.y));
          s.el.setAttribute("opacity", "0.92");
          return;
        }
        var pt = s.path.getPointAtLength(len * (tRel / s.dur));
        s.el.setAttribute("cx", String(pt.x));
        s.el.setAttribute("cy", String(pt.y));
        s.el.setAttribute("opacity", "1");
      });

      if (elapsed >= totalMs) {
        if (opts.onComplete) opts.onComplete();
        return;
      }
      rafId = global.requestAnimationFrame(tick);
    }

    rafId = global.requestAnimationFrame(tick);

    return {
      totalMs: totalMs,
      cancel: function () {
        if (rafId != null) global.cancelAnimationFrame(rafId);
        rafId = null;
        startWall = null;
        state.forEach(function (s) {
          if (s.el.parentNode) s.el.parentNode.removeChild(s.el);
        });
        state.length = 0;
      },
    };
  }

  global.ManifestPlayer = {
    start: start,
    routeKey: routeKey,
    resolvePathId: resolvePathId,
    prepareLegs: prepareLegs,
  };
})(typeof window !== "undefined" ? window : globalThis);
