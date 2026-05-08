/**
 * Ensures common/styles.css loads when preview servers or odd URL bases break relative CSS.
 * Requires: <link rel="stylesheet" href="..." id="main-styles"> (href is ../../common/styles.css or common/styles.css).
 */
(function () {
    function primaryStylesOk(link) {
        if (!link || !link.sheet) return false;
        try {
            return link.sheet.cssRules && link.sheet.cssRules.length > 0;
        } catch (e) {
            return true;
        }
    }

    function ensureStyles() {
        var link = document.getElementById('main-styles');
        if (primaryStylesOk(link)) return;

        var p = location.pathname || '';
        var dir = p.replace(/\/[^/]*$/, '/');
        var up = dir.replace(/\/[^/]+\/$/, '/');

        if (up && up !== dir) {
            var fallback = document.createElement('link');
            fallback.rel = 'stylesheet';
            fallback.href = up + 'common/styles.css';
            fallback.setAttribute('data-ensure-styles-fallback', '');
            document.head.appendChild(fallback);
            return;
        }

        /* Root-ish URL: primary may be common/styles.css — try parent-relative */
        var fb = document.createElement('link');
        fb.rel = 'stylesheet';
        fb.href = '../common/styles.css';
        fb.setAttribute('data-ensure-styles-fallback', '');
        document.head.appendChild(fb);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureStyles);
    else ensureStyles();
    setTimeout(ensureStyles, 150);
})();
