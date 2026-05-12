/**
 * Zero-Knowledge track — hub rendering, progress, module page init.
 * Depends on ZK_COURSE_DATA (zk-course-data.js loaded first).
 */

const ZK_PROGRESS_KEY = 'zk-track-course-progress';

const AVAILABLE_ZK_MODULES = [
    'zk-l01-m01', 'zk-l01-m02', 'zk-l01-m03',
    'zk-l02-m01', 'zk-l02-m02', 'zk-l02-m03',
    'zk-l03-m01', 'zk-l03-m02', 'zk-l03-m03',
    'zk-l04-m01', 'zk-l04-m02', 'zk-l04-m03',
    'zk-l05-m01', 'zk-l05-m02', 'zk-l05-m03',
    'zk-l06-m01', 'zk-l06-m02', 'zk-l06-m03',
    'zk-l07-m01', 'zk-l07-m02', 'zk-l07-m03'
];

function isZkModuleAvailable(moduleId) {
    return AVAILABLE_ZK_MODULES.includes(moduleId);
}

function loadZkProgress() {
    try {
        const saved = localStorage.getItem(ZK_PROGRESS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

function saveZkProgress(progress) {
    localStorage.setItem(ZK_PROGRESS_KEY, JSON.stringify(progress));
}

function getZkModuleStatus(moduleId) {
    const progress = loadZkProgress();
    return progress[moduleId] || 'pending';
}

function zkStartModule(moduleId) {
    const progress = loadZkProgress();
    if (progress[moduleId] !== 'completed') {
        progress[moduleId] = 'in-progress';
        saveZkProgress(progress);
    }
}

function zkCompleteModule(moduleId) {
    const progress = loadZkProgress();
    progress[moduleId] = 'completed';
    saveZkProgress(progress);
}

function calculateZkOverallProgress() {
    const progress = loadZkProgress();
    const modules =
        typeof ZK_COURSE_DATA !== 'undefined' && ZK_COURSE_DATA.modules ? ZK_COURSE_DATA.modules : [];
    let completed = 0;
    for (let i = 0; i < modules.length; i++) {
        if (progress[modules[i].id] === 'completed') completed++;
    }
    return modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;
}

function updateZkProgress() {
    const pct = calculateZkOverallProgress();
    const fill = document.getElementById('zk-overall-progress');
    const text = document.getElementById('zk-progress-text');
    if (fill) {
        fill.style.width = pct + '%';
        fill.textContent = pct + '%';
    }
    if (text) text.textContent = pct + '% Complete';
}

function getZkCourseLevelMetaRow(levelNum) {
    const rows = ZK_COURSE_DATA.courseLevelMeta || [];
    return rows.find(function (x) {
        return x.level === levelNum;
    });
}

const ZK_STATUS_CONFIG = {
    completed: { class: 'completed', text: 'Completed', badge: 'status-completed' },
    'in-progress': { class: 'in-progress', text: 'In Progress', badge: 'status-in-progress' },
    pending: { class: '', text: 'Not Started', badge: 'status-pending' }
};

function renderZkModuleCard(module, status) {
    const isAvailable = isZkModuleAvailable(module.id);
    const statusKey = status in ZK_STATUS_CONFIG ? status : 'pending';
    const cfg = ZK_STATUS_CONFIG[statusKey];

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
          '<span class="module-time-value">' +
          module.duration +
          '</span>' +
          '<span class="module-time-label">Segments · read &amp; tinker</span>' +
          '</div>'
        : '';

    return (
        '<a href="' +
        href +
        '" ' +
        onClick +
        ' class="' +
        cardClass +
        '">' +
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

function renderZkCourseLevelGroups(minLevel, maxLevel) {
    let html = '';
    const modules = ZK_COURSE_DATA.modules;
    for (let L = minLevel; L <= maxLevel; L++) {
        const group = modules.filter(function (m) {
            return Number(m.courseLevel) === L;
        });
        if (!group.length) continue;
        const meta = getZkCourseLevelMetaRow(L);
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
            html += renderZkModuleCard(mod, getZkModuleStatus(mod.id));
        });
        html += '</div></div>';
    }
    return html;
}

function initializeZkCourseIndex() {
    const basic = document.getElementById('zk-basic-modules');
    const inter = document.getElementById('zk-intermediate-modules');
    const adv = document.getElementById('zk-advanced-modules');
    if (basic) basic.innerHTML = renderZkCourseLevelGroups(1, 1);
    if (inter) inter.innerHTML = renderZkCourseLevelGroups(2, 5);
    if (adv) adv.innerHTML = renderZkCourseLevelGroups(6, 7);
    updateZkProgress();
}

function markZkModuleComplete(moduleId) {
    zkCompleteModule(moduleId);
    updateZkProgress();
    const message = document.createElement('div');
    message.style.cssText =
        'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:1rem;border-radius:8px;z-index:1000;';
    message.textContent = '✅ Module completed!';
    document.body.appendChild(message);
    setTimeout(function () {
        message.remove();
    }, 3000);
}

function initializeZkModulePage(moduleId) {
    zkStartModule(moduleId);
    const completeBtn = document.getElementById('complete-module-btn');
    if (completeBtn) {
        completeBtn.onclick = function () {
            if (
                confirm(
                    'Have you completed all segments and the hands-on portion for this module?'
                )
            ) {
                markZkModuleComplete(moduleId);
                completeBtn.textContent = '✓ Completed';
                completeBtn.disabled = true;
            }
        };
    }
}
