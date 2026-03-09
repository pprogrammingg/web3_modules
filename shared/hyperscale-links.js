/**
 * Apply hyperscale-rs repo links from shared flow data.
 * Load after hyperscale-flow-data.js. Sets href on elements with:
 *   data-crate="name"  → crateUrl(name) (tree)
 *   data-file="path"  → fileUrl(path) (blob)
 *   data-repo         → REPO_BASE_URL
 */
(function () {
    'use strict';
    function applyHyperscaleLinks() {
        var d = typeof window !== 'undefined' && window.HYPERSCALE_FLOW_DATA;
        if (!d) return;
        document.querySelectorAll('a[data-crate]').forEach(function (a) {
            var c = a.getAttribute('data-crate');
            if (c) a.href = d.crateUrl(c);
        });
        document.querySelectorAll('a[data-file]').forEach(function (a) {
            var p = a.getAttribute('data-file');
            if (p) a.href = d.fileUrl(p);
        });
        document.querySelectorAll('a[data-repo]').forEach(function (a) {
            a.href = d.REPO_BASE_URL;
        });
    }
    if (typeof document === 'undefined') return;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyHyperscaleLinks);
    } else {
        applyHyperscaleLinks();
    }
})();
