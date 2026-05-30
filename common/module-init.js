/**
 * Module page initializer. Load after course-data.js and navigation.js.
 * Use: <script src="../../common/module-init.js" data-module-id="basic-01"></script>
 */
(function () {
    var el = document.currentScript;
    var mid = el && el.getAttribute('data-module-id');
    if (!mid) return;

    var trackInits = [
        { prefix: 'crypto-', fn: 'initializeCryptoModulePage' },
        { prefix: 'zk-l', fn: 'initializeZkModulePage' },
        { prefix: 'evm-l', fn: 'initializeEvmModulePage' }
    ];

    var matched = false;
    for (var i = 0; i < trackInits.length; i++) {
        var t = trackInits[i];
        if (mid.indexOf(t.prefix) === 0 && typeof window[t.fn] === 'function') {
            window[t.fn](mid);
            matched = true;
            break;
        }
    }
    if (!matched && typeof initializeModulePage === 'function') {
        initializeModulePage(mid);
    }

    function runRustHighlight() {
        if (typeof highlightRustSnippets === 'function') {
            highlightRustSnippets();
        }
    }

    if (typeof highlightRustSnippets === 'function') {
        runRustHighlight();
    } else if (el && el.src) {
        var hl = document.createElement('script');
        hl.src = el.src.replace(/\/[^/]+$/, '/') + 'rust-highlight.js';
        hl.onload = runRustHighlight;
        document.head.appendChild(hl);
    }
})();
