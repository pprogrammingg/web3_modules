/**
 * EVM / Ethereum protocol track — hub rendering, progress, module page init.
 * Depends on EVM_COURSE_DATA (evm-course-data.js loaded first).
 */

const EVM_PROGRESS_KEY = 'evm-track-course-progress';

const AVAILABLE_EVM_MODULES = ['evm-l01-m01', 'evm-l02-m01', 'evm-l02-m02'];

function isEvmModuleAvailable(moduleId) {
    return AVAILABLE_EVM_MODULES.includes(moduleId);
}

function loadEvmProgress() {
    try {
        const saved = localStorage.getItem(EVM_PROGRESS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

function saveEvmProgress(progress) {
    localStorage.setItem(EVM_PROGRESS_KEY, JSON.stringify(progress));
}

function getEvmModuleStatus(moduleId) {
    const progress = loadEvmProgress();
    return progress[moduleId] || 'pending';
}

function evmStartModule(moduleId) {
    const progress = loadEvmProgress();
    if (progress[moduleId] !== 'completed') {
        progress[moduleId] = 'in-progress';
        saveEvmProgress(progress);
    }
}

function evmCompleteModule(moduleId) {
    const progress = loadEvmProgress();
    progress[moduleId] = 'completed';
    saveEvmProgress(progress);
}

function calculateEvmOverallProgress() {
    const progress = loadEvmProgress();
    const modules =
        typeof EVM_COURSE_DATA !== 'undefined' && EVM_COURSE_DATA.modules ? EVM_COURSE_DATA.modules : [];
    let completed = 0;
    for (let i = 0; i < modules.length; i++) {
        if (progress[modules[i].id] === 'completed') completed++;
    }
    return modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;
}

function updateEvmProgress() {
    const pct = calculateEvmOverallProgress();
    const fill = document.getElementById('evm-overall-progress');
    const text = document.getElementById('evm-progress-text');
    if (fill) {
        fill.style.width = pct + '%';
        fill.textContent = pct + '%';
    }
    if (text) text.textContent = pct + '% Complete';
}

function getEvmCourseLevelMetaRow(levelNum) {
    const rows = EVM_COURSE_DATA.courseLevelMeta || [];
    return rows.find(function (x) {
        return x.level === levelNum;
    });
}

const EVM_STATUS_CONFIG = {
    completed: { class: 'completed', text: 'Completed', badge: 'status-completed' },
    'in-progress': { class: 'in-progress', text: 'In Progress', badge: 'status-in-progress' },
    pending: { class: '', text: 'Not Started', badge: 'status-pending' }
};

function renderEvmModuleCard(module, status) {
    const isAvailable = isEvmModuleAvailable(module.id);
    const statusKey = status in EVM_STATUS_CONFIG ? status : 'pending';
    const cfg = EVM_STATUS_CONFIG[statusKey];

    const isContribution = module.contributionModule === true;
    const isLab = module.codingLab === true;
    const labBadge = isLab && !isContribution ? '<span class="badge-lab">Hands-on segments</span>' : '';
    const contribBadge = isContribution ? '<span class="badge-contribution">Guided build</span>' : '';
    const availableBadge = isAvailable ? '<span class="badge-available">✓ Available</span>' : '<span class="badge-coming">Coming Soon</span>';
    const contribCardClass = isContribution ? ' module-card--contribution' : '';

    const cardClass = isAvailable
        ? 'module-card available ' + cfg.class + contribCardClass
        : 'module-card unavailable ' + cfg.class + contribCardClass;
    const href = isAvailable ? courseModuleHrefForHub(module.path, 'evm') : '#';
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

function renderEvmCourseLevelGroups(minLevel, maxLevel) {
    let html = '';
    const modules = EVM_COURSE_DATA.modules;
    for (let L = minLevel; L <= maxLevel; L++) {
        const group = modules.filter(function (m) {
            return Number(m.courseLevel) === L;
        });
        if (!group.length) continue;
        const meta = getEvmCourseLevelMetaRow(L);
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
            html += renderEvmModuleCard(mod, getEvmModuleStatus(mod.id));
        });
        html += '</div></div>';
    }
    return html;
}

function initializeEvmCourseIndex() {
    const root = document.getElementById('evm-modules');
    if (root) root.innerHTML = renderEvmCourseLevelGroups(1, 99);
    updateEvmProgress();
}

function markEvmModuleComplete(moduleId) {
    evmCompleteModule(moduleId);
    updateEvmProgress();
    const message = document.createElement('div');
    message.style.cssText =
        'position:fixed;top:20px;right:20px;background:#0d9488;color:white;padding:1rem;border-radius:8px;z-index:1000;';
    message.textContent = '✅ Module completed!';
    document.body.appendChild(message);
    setTimeout(function () {
        message.remove();
    }, 3000);
}

function initializeEvmModulePage(moduleId) {
    evmStartModule(moduleId);
    const completeBtn = document.getElementById('complete-module-btn');
    if (completeBtn) {
        completeBtn.onclick = function () {
            if (
                confirm(
                    'Have you completed all segments and the hands-on portion for this module?'
                )
            ) {
                markEvmModuleComplete(moduleId);
                completeBtn.textContent = '✓ Completed';
                completeBtn.disabled = true;
            }
        };
    }
}
