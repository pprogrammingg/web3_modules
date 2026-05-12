/**
 * Module page initializer. Load after course-data.js and navigation.js.
 * Use: <script src="../../common/module-init.js" data-module-id="basic-01"></script>
 * Replaces inline initializeModulePage('id') so all JS is factored out.
 */
(function() {
    var el = document.currentScript;
    var mid = el && el.getAttribute('data-module-id');
    if (mid) {
        if (mid.indexOf('crypto-') === 0 && typeof initializeCryptoModulePage === 'function') {
            initializeCryptoModulePage(mid);
        } else if (mid.indexOf('zk-l') === 0 && typeof initializeZkModulePage === 'function') {
            initializeZkModulePage(mid);
        } else if (mid.indexOf('evm-l') === 0 && typeof initializeEvmModulePage === 'function') {
            initializeEvmModulePage(mid);
        } else if (typeof initializeModulePage === 'function') {
            initializeModulePage(mid);
        }
        if (
            typeof injectProtocolEngineerPanel === 'function' &&
            mid.indexOf('crypto-') !== 0 &&
            mid.indexOf('zk-l') !== 0 &&
            mid.indexOf('evm-l') !== 0
        ) {
            injectProtocolEngineerPanel(mid);
        }
    }
})();
