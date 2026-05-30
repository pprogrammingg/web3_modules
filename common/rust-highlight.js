/**
 * Lightweight Rust syntax highlighting for static module pages (offline, no CDN).
 * Targets .code-block code.language-rust and .hs-phase-proof code.
 */
(function () {
    'use strict';

    var KEYWORDS = new Set([
        'if', 'let', 'match', 'return', 'break', 'continue', 'else', 'for', 'while', 'loop',
        'fn', 'pub', 'mut', 'use', 'struct', 'enum', 'impl', 'trait', 'mod', 'crate',
        'async', 'await', 'move', 'ref', 'Self', 'self', 'super', 'crate',
        'Some', 'None', 'Ok', 'Err', 'true', 'false', 'as', 'in', 'where', 'type'
    ]);

    function escapeHtml(s) {
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function highlightLine(line) {
        var out = '';
        var i = 0;
        var len = line.length;

        while (i < len) {
            if (line.charAt(i) === ' ' || line.charAt(i) === '\t') {
                var ws = '';
                while (i < len && (line.charAt(i) === ' ' || line.charAt(i) === '\t')) {
                    ws += line.charAt(i);
                    i++;
                }
                out += escapeHtml(ws);
                continue;
            }

            if (line.startsWith('//', i)) {
                out += '<span class="rust-hl-comment">' + escapeHtml(line.slice(i)) + '</span>';
                break;
            }

            if (line.charAt(i) === '"') {
                var j = i + 1;
                while (j < len && line.charAt(j) !== '"') {
                    if (line.charAt(j) === '\\' && j + 1 < len) j += 2;
                    else j++;
                }
                if (j < len) j++;
                out += '<span class="rust-hl-string">' + escapeHtml(line.slice(i, j)) + '</span>';
                i = j;
                continue;
            }

            if (/[A-Za-z_]/.test(line.charAt(i))) {
                var k = i;
                while (k < len && /[\w:]/.test(line.charAt(k))) k++;
                var word = line.slice(i, k);
                var next = line.charAt(k);
                var cls = 'rust-hl-ident';
                if (KEYWORDS.has(word)) cls = 'rust-hl-keyword';
                else if (word.indexOf('::') !== -1) cls = 'rust-hl-path';
                else if (next === '(') cls = 'rust-hl-fn';
                else if (/^[A-Z]/.test(word)) cls = 'rust-hl-type';
                out += '<span class="' + cls + '">' + escapeHtml(word) + '</span>';
                i = k;
                continue;
            }

            if (line.charAt(i) === '{' || line.charAt(i) === '}') {
                out += '<span class="rust-hl-punct">' + escapeHtml(line.charAt(i)) + '</span>';
                i++;
                continue;
            }

            out += escapeHtml(line.charAt(i));
            i++;
        }

        return out;
    }

    function highlightRust(text) {
        return text.split('\n').map(highlightLine).join('\n');
    }

    function highlightElement(codeEl) {
        if (!codeEl || codeEl.getAttribute('data-rust-highlighted') === '1') return;
        var text = codeEl.textContent;
        codeEl.innerHTML = highlightRust(text);
        codeEl.setAttribute('data-rust-highlighted', '1');
    }

    function highlightRustSnippets(root) {
        var scope = root || document;
        var selector =
            '.code-block code.language-rust, .hs-phase-proof .code-block code, .hs-phase-proof pre code';
        scope.querySelectorAll(selector).forEach(highlightElement);
    }

    window.highlightRustSnippets = highlightRustSnippets;

    function boot() {
        highlightRustSnippets();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
