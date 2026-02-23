/**
 * Module page initializer. Load after course-data.js and navigation.js.
 * Use: <script src="../shared/module-init.js" data-module-id="basic-01"></script>
 * Replaces inline initializeModulePage('id') so all JS is factored out.
 */
(function() {
    var el = document.currentScript;
    if (el && el.getAttribute('data-module-id')) {
        if (typeof initializeModulePage === 'function') {
            initializeModulePage(el.getAttribute('data-module-id'));
        }
    }
})();
