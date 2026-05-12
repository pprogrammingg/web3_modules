#!/usr/bin/env node
/**
 * Guard: hub module card hrefs must be track-relative (see courseModuleHrefForHub in navigation.js).
 * Duplicates that helper’s logic — keep in sync if the helper changes.
 */
function courseModuleHrefForHub(modulePath, trackFolder) {
    if (!modulePath || !trackFolder) return modulePath;
    const prefix = trackFolder + '/';
    if (modulePath.indexOf(prefix) === 0) return modulePath.slice(prefix.length);
    return modulePath;
}

const { pathToFileURL } = require('url');

function assertEq(a, b, msg) {
    if (a !== b) {
        console.error('  ❌', msg, '\n    expected:', b, '\n    actual:', a);
        process.exit(1);
    }
    console.log('  ✅', msg);
}

console.log('hub-href-contract: hub link resolution\n');

assertEq(courseModuleHrefForHub('evm/level-01/x.html', 'evm'), 'level-01/x.html', 'evm strip');
assertEq(
    courseModuleHrefForHub('crypto-fintech/level-01/x.html', 'crypto-fintech'),
    'level-01/x.html',
    'crypto-fintech strip'
);
assertEq(courseModuleHrefForHub('zk/level-02/y.html', 'zk'), 'level-02/y.html', 'zk strip');
assertEq(
    courseModuleHrefForHub('hyperscale/basic/z.html', 'hyperscale'),
    'basic/z.html',
    'hyperscale strip'
);

const resolved = new URL(
    courseModuleHrefForHub('evm/level-01/module-01-ethereum-evm-syllabus.html', 'evm'),
    pathToFileURL('/repo/evm/index.html')
).pathname;
assertEq(resolved, '/repo/evm/level-01/module-01-ethereum-evm-syllabus.html', 'file URL resolves without doubled evm/');

console.log('\nhub-href-contract: OK');
