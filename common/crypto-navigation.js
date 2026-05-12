/**
 * Cryptography for Blockchains & FinTech — hub rendering, progress, module page init.
 * Depends on CRYPTO_COURSE_DATA (crypto-course-data.js loaded first).
 */

const CRYPTO_PROGRESS_KEY = 'crypto-fintech-course-progress';

const AVAILABLE_CRYPTO_MODULES = [
    'crypto-l01-m01', 'crypto-l01-m02', 'crypto-l01-m03',
    'crypto-l02-m01', 'crypto-l02-m02', 'crypto-l02-m03',
    'crypto-l03-m01', 'crypto-l03-m02', 'crypto-l03-m03',
    'crypto-l04-m01', 'crypto-l04-m02', 'crypto-l04-m03',
    'crypto-l05-m01', 'crypto-l05-m02', 'crypto-l05-m03',
    'crypto-l06-m01', 'crypto-l06-m02', 'crypto-l06-m03',
    'crypto-l07-m01', 'crypto-l07-m02', 'crypto-l07-m03'
];

function isCryptoModuleAvailable(moduleId) {
    return AVAILABLE_CRYPTO_MODULES.includes(moduleId);
}

function loadCryptoProgress() {
    try {
        const saved = localStorage.getItem(CRYPTO_PROGRESS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

function saveCryptoProgress(progress) {
    localStorage.setItem(CRYPTO_PROGRESS_KEY, JSON.stringify(progress));
}

function getCryptoModuleStatus(moduleId) {
    const progress = loadCryptoProgress();
    return progress[moduleId] || 'pending';
}

function cryptoStartModule(moduleId) {
    const progress = loadCryptoProgress();
    if (progress[moduleId] !== 'completed') {
        progress[moduleId] = 'in-progress';
        saveCryptoProgress(progress);
    }
}

function cryptoCompleteModule(moduleId) {
    const progress = loadCryptoProgress();
    progress[moduleId] = 'completed';
    saveCryptoProgress(progress);
}

function calculateCryptoOverallProgress() {
    const progress = loadCryptoProgress();
    const modules = (typeof CRYPTO_COURSE_DATA !== 'undefined' && CRYPTO_COURSE_DATA.modules)
        ? CRYPTO_COURSE_DATA.modules
        : [];
    let completed = 0;
    for (let i = 0; i < modules.length; i++) {
        if (progress[modules[i].id] === 'completed') completed++;
    }
    return modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;
}

function updateCryptoProgress() {
    const pct = calculateCryptoOverallProgress();
    const fill = document.getElementById('crypto-overall-progress');
    const text = document.getElementById('crypto-progress-text');
    if (fill) {
        fill.style.width = pct + '%';
        fill.textContent = pct + '%';
    }
    if (text) text.textContent = pct + '% Complete';
}

function getCryptoCourseLevelMetaRow(levelNum) {
    const rows = CRYPTO_COURSE_DATA.courseLevelMeta || [];
    return rows.find(function (x) {
        return x.level === levelNum;
    });
}

const CRYPTO_STATUS_CONFIG = {
    completed: { class: 'completed', text: 'Completed', badge: 'status-completed' },
    'in-progress': { class: 'in-progress', text: 'In Progress', badge: 'status-in-progress' },
    pending: { class: '', text: 'Not Started', badge: 'status-pending' }
};

function renderCryptoModuleCard(module, status) {
    const isAvailable = isCryptoModuleAvailable(module.id);
    const statusKey = status in CRYPTO_STATUS_CONFIG ? status : 'pending';
    const cfg = CRYPTO_STATUS_CONFIG[statusKey];

    const isContribution = module.contributionModule === true;
    const isLab = module.codingLab === true;
    const labBadge = isLab && !isContribution ? '<span class="badge-lab">Hands-on segments</span>' : '';
    const contribBadge = isContribution ? '<span class="badge-contribution">Guided build</span>' : '';
    const availableBadge = isAvailable ? '<span class="badge-available">✓ Available</span>' : '<span class="badge-coming">Coming Soon</span>';
    const contribCardClass = isContribution ? ' module-card--contribution' : '';

    const cardClass = isAvailable
        ? 'module-card available ' + cfg.class + contribCardClass
        : 'module-card unavailable ' + cfg.class + contribCardClass;
    const href = isAvailable ? module.path : '#';
    const onClick = isAvailable ? '' : 'onclick="event.preventDefault(); return false;"';

    const timeEstimateHtml = module.duration
        ? '<div class="module-time-estimate" title="Reading segments + optional lab time">' +
          '<span class="module-time-icon" aria-hidden="true">⏱</span>' +
          '<span class="module-time-value">' + module.duration + '</span>' +
          '<span class="module-time-label">Segments · read &amp; tinker</span>' +
          '</div>'
        : '';

    return (
        '<a href="' + href + '" ' + onClick + ' class="' + cardClass + '">' +
        '<h3 class="module-title-with-badges">' +
        module.title +
        labBadge +
        contribBadge +
        availableBadge +
        '</h3>' +
        '<p>' +
        module.description +
        '</p>' +
        timeEstimateHtml +
        '<div class="module-meta">' +
        '<span>' +
        module.difficulty +
        '</span>' +
        '<span class="module-status ' +
        cfg.badge +
        '">' +
        cfg.text +
        '</span>' +
        '</div>' +
        '</a>'
    );
}

function renderCryptoCourseLevelGroups(minLevel, maxLevel) {
    let html = '';
    const modules = CRYPTO_COURSE_DATA.modules;
    for (let L = minLevel; L <= maxLevel; L++) {
        const group = modules.filter(function (m) {
            return Number(m.courseLevel) === L;
        });
        if (!group.length) continue;
        const meta = getCryptoCourseLevelMetaRow(L);
        const label = meta && meta.title ? meta.title : '';
        const colorSlot = ((L - 1) % 5) + 1;
        html += '<div class="course-level-band course-level-band--' + colorSlot + '" data-course-level="' + L + '">';
        html += '<div class="course-level-band-header">';
        html += '<h3 class="course-level-band-title">Level ' + L + (label ? ' — ' + label : '') + '</h3>';
        if (meta && meta.description) {
            html += '<p class="course-level-band-desc">' + meta.description + '</p>';
        }
        if (meta && meta.careerBand) {
            html += '<p class="course-level-band-career">Engineering ladder: ' + meta.careerBand + '</p>';
        }
        html += '</div>';
        html += '<div class="module-grid module-grid--in-phase">';
        group.forEach(function (mod) {
            html += renderCryptoModuleCard(mod, getCryptoModuleStatus(mod.id));
        });
        html += '</div></div>';
    }
    return html;
}

function initializeCryptoCourseIndex() {
    const basic = document.getElementById('crypto-basic-modules');
    const inter = document.getElementById('crypto-intermediate-modules');
    const adv = document.getElementById('crypto-advanced-modules');
    if (basic) basic.innerHTML = renderCryptoCourseLevelGroups(1, 1);
    if (inter) inter.innerHTML = renderCryptoCourseLevelGroups(2, 5);
    if (adv) adv.innerHTML = renderCryptoCourseLevelGroups(6, 7);
    updateCryptoProgress();
}

function markCryptoModuleComplete(moduleId) {
    cryptoCompleteModule(moduleId);
    updateCryptoProgress();
    const message = document.createElement('div');
    message.style.cssText =
        'position:fixed;top:20px;right:20px;background:#ea580c;color:white;padding:1rem;border-radius:8px;z-index:1000;';
    message.textContent = '✅ Module completed!';
    document.body.appendChild(message);
    setTimeout(function () {
        message.remove();
    }, 3000);
}

function initializeCryptoModulePage(moduleId) {
    cryptoStartModule(moduleId);
    const completeBtn = document.getElementById('complete-module-btn');
    if (completeBtn) {
        completeBtn.onclick = function () {
            if (
                confirm(
                    'Have you completed all segments and the hands-on portion for this module?'
                )
            ) {
                markCryptoModuleComplete(moduleId);
                completeBtn.textContent = '✓ Completed';
                completeBtn.disabled = true;
            }
        };
    }
}
