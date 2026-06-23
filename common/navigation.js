// Navigation and course rendering utilities

/**
 * Course `path` values are repo-root-relative (e.g. `evm/level-01/x.html`).
 * On a track hub at `/evm/index.html`, linking to `evm/level-01/x.html` wrongly resolves to `/evm/evm/level-01/x.html`.
 * Strip `trackFolder/` so hub cards use paths relative to the track directory.
 */
function courseModuleHrefForHub(modulePath, trackFolder) {
    if (!modulePath || !trackFolder) return modulePath;
    var prefix = trackFolder + '/';
    if (modulePath.indexOf(prefix) === 0) return modulePath.slice(prefix.length);
    return modulePath;
}

// List of modules that are actually available (have HTML files)
const AVAILABLE_MODULES = [
    'basic-01',
    'basic-02',
    'basic-03',
    'basic-04',
    'intermediate-hs-overview',
    'basic-05b',
    'hs-phase-01',
    'hs-phase-02',
    'hs-phase-03',
    'hs-phase-04',
    'hs-block-fields',
    'hs-timers',
    'hs-e2e-harness',
    'hs-improved-sim-tests',
    'hs-improved-prod-tests',
    'hs-jmt-deep-dive',
    'hs-improved-cross-shard-sim-tests',
    'hs-improved-cross-shard-prod-tests',
    'intermediate-08',
    'intermediate-performance',
    'intermediate-rust-optimization',
    'basic-07',
    'intermediate-libp2p',
    'advanced-libp2p',
];

function isModuleAvailable(moduleId) {
    return AVAILABLE_MODULES.includes(moduleId);
}

function findCourseModule(moduleId) {
    if (typeof COURSE_DATA === 'undefined' || !COURSE_DATA.levels) return null;
    var found = null;
    ['basic', 'intermediate', 'advanced'].forEach(function (tier) {
        var mods = COURSE_DATA.levels[tier] && COURSE_DATA.levels[tier].modules;
        if (!mods) return;
        mods.forEach(function (m) {
            if (m.id === moduleId) found = m;
        });
    });
    return found;
}

function isHandsOnModule(module) {
    return module && (module.kind === 'project' || module.hasMajorAssignment === true);
}

function initializeCourseIndex() {
    renderModules();
    updateProgress();
}

function getCourseLevelMetaRow(levelNum) {
    const rows = COURSE_DATA.courseLevelMeta || [];
    return rows.find(function (x) {
        return x.level === levelNum;
    });
}

function getMaxCourseLevel() {
    const rows = COURSE_DATA.courseLevelMeta || [];
    if (!rows.length) return 7;
    return Math.max.apply(
        null,
        rows.map(function (r) {
            return r.level;
        })
    );
}

/**
 * Group modules by global `courseLevel` (1…N). Colors cycle every 5 bands via `course-level-band--1…5`.
 */
function renderCourseLevelGroups(modules, minLevel, maxLevel) {
    var html = '';
    for (var L = minLevel; L <= maxLevel; L++) {
        var group = modules.filter(function (m) {
            return (m.courseLevel != null ? Number(m.courseLevel) : 0) === L;
        });
        if (!group.length) continue;
        var meta = getCourseLevelMetaRow(L);
        var label = meta && meta.title ? meta.title : '';
        var colorSlot = ((L - 1) % 5) + 1;
        html += '<div class="course-level-band course-level-band--' + colorSlot + '" data-course-level="' + L + '">';
        html += '<div class="course-level-band-header">';
        html +=
            '<h3 class="course-level-band-title">Level ' +
            L +
            (label ? ' — ' + label : '') +
            '</h3>';
        if (meta && meta.description) {
            html += '<p class="course-level-band-desc">' + meta.description + '</p>';
        }
        if (meta && meta.careerBand) {
            html += '<p class="course-level-band-career">Engineering ladder: ' + meta.careerBand + '</p>';
        }
        html += '</div>';
        html += '<div class="module-grid module-grid--in-phase">';
        group.forEach(function (module) {
            html += renderModuleCard(module, getModuleStatus(module.id));
        });
        html += '</div></div>';
    }
    return html;
}

function renderModules() {
    const levels = ['basic', 'intermediate', 'advanced'];

    levels.forEach(level => {
        const container = document.getElementById(`${level}-modules`);
        if (!container) return;

        const levelData = COURSE_DATA.levels[level];
        if (!levelData) return;

        if (level === 'basic') {
            container.innerHTML = renderCourseLevelGroups(levelData.modules, 1, 1);
            return;
        }
        if (level === 'intermediate') {
            container.innerHTML = renderCourseLevelGroups(levelData.modules, 2, 7);
            return;
        }
        if (level === 'advanced') {
            container.innerHTML = renderCourseLevelGroups(levelData.modules, 8, 8);
            return;
        }

        let html = '';
        levelData.modules.forEach(module => {
            const status = getModuleStatus(module.id);
            html += renderModuleCard(module, status);
        });

        container.innerHTML = html;
    });

    renderHyperscaleModules();
}

function renderHyperscaleModules() {
    const container = document.getElementById('hyperscale-modules');
    if (!container) return;

    const maxL = getMaxCourseLevel();
    let html = '';
    for (let L = 1; L <= maxL; L++) {
        const mods = [];
        ['basic', 'intermediate', 'advanced'].forEach(function (tier) {
            COURSE_DATA.levels[tier].modules.forEach(function (m) {
                if (m.hyperscaleSpecific && Number(m.courseLevel) === L) {
                    mods.push(m);
                }
            });
        });
        if (mods.length === 0) continue;
        html += renderCourseLevelGroups(mods, L, L);
    }
    container.innerHTML = html;
}

const STATUS_CONFIG = {
    completed: { class: 'completed', text: 'Completed', badge: 'status-completed' },
    'in-progress': { class: 'in-progress', text: 'In Progress', badge: 'status-in-progress' },
    pending: { class: '', text: 'Not Started', badge: 'status-pending' }
};

function renderModuleCard(module, status) {
    const isAvailable = isModuleAvailable(module.id);
    const statusKey = status in STATUS_CONFIG ? status : 'pending';
    const { class: statusClass, text: statusText, badge: statusClassBadge } = STATUS_CONFIG[statusKey];

    const isProject = isHandsOnModule(module);
    const isContribution = module.contributionModule === true;
    const projectBadge = isProject ? '<span class="badge-project">Hands-on project</span>' : '';
    const contribBadge = isContribution ? '<span class="badge-contribution">OSS contribution</span>' : '';
    const badge = module.hyperscaleSpecific ? '<span class="badge-hyperscale">Hyperscale-rs</span>' : '';
    const availableBadge = isAvailable ? '<span class="badge-available">✓ Available</span>' : '<span class="badge-coming">Coming Soon</span>';
    const projectCardClass = isProject ? ' module-card--project' : '';
    const contribCardClass = isContribution ? ' module-card--contribution' : '';
    const cardClass = isAvailable
        ? `module-card available ${statusClass}${projectCardClass}${contribCardClass}`
        : `module-card unavailable ${statusClass}${projectCardClass}${contribCardClass}`;
    const href = isAvailable ? courseModuleHrefForHub(module.path, 'hyperscale') : '#';
    const onClick = isAvailable ? '' : 'onclick="event.preventDefault(); return false;"';
    
    const timeEstimateHtml = module.duration
        ? `<div class="module-time-estimate" title="Rough time to read, understand and complete">
             <span class="module-time-icon" aria-hidden="true">⏱</span>
             <span class="module-time-value">${module.duration}</span>
             <span class="module-time-label">Read, understand & complete</span>
           </div>`
        : '';

    return `
        <a href="${href}" ${onClick} class="${cardClass}">
            <h3 class="module-title-with-badges">${module.title}${projectBadge}${contribBadge}${badge}${availableBadge}</h3>
            <p>${module.description}</p>
            ${timeEstimateHtml}
            <div class="module-meta">
                <span>${module.difficulty}</span>
                <span class="module-status ${statusClassBadge}">${statusText}</span>
            </div>
        </a>
    `;
}

function updateProgress() {
    const progress = calculateOverallProgress();
    const progressFill = document.getElementById('overall-progress');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
        progressFill.textContent = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${progress}% Complete`;
    }
}

// Quiz functionality
function initializeQuiz(quizId, questions, passingScore = 70) {
    const quizContainer = document.getElementById(quizId);
    if (!quizContainer) return;
    
    let userAnswers = {};
    let quizSubmitted = false;
    
    // Render questions
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <div class="question-text">${index + 1}. ${question.question}</div>
            <div class="options">
                ${question.options.map((option, optIndex) => `
                    <div class="option" data-question="${index}" data-option="${optIndex}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;
        quizContainer.appendChild(questionDiv);
    });
    
    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Submit Quiz';
    submitBtn.onclick = () => submitQuiz(quizId, questions, userAnswers, passingScore);
    quizContainer.appendChild(submitBtn);
    
    // Handle option selection
    quizContainer.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            if (quizSubmitted) return;
            
            const questionIndex = parseInt(this.dataset.question, 10);
            const optionIndex = parseInt(this.dataset.option, 10);
            
            // Remove previous selection
            const questionDiv = this.closest('.question');
            questionDiv.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Mark this option as selected
            this.classList.add('selected');
            userAnswers[questionIndex] = optionIndex;
        });
    });
}

function submitQuiz(quizId, questions, userAnswers, passingScore) {
    const quizContainer = document.getElementById(quizId);
    if (!quizContainer) return;
    
    let correct = 0;
    const total = questions.length;
    
    // Check answers and highlight correct/incorrect options and wrong-answered questions
    questions.forEach((question, index) => {
        const userAnswer = Number(userAnswers[index]);
        const correctAnswer = Number(question.correct);
        const isWrong = userAnswer !== correctAnswer;
        const optionDivs = quizContainer.querySelectorAll(`[data-question="${index}"]`);
        const questionDiv = quizContainer.querySelectorAll('.question')[index];

        optionDivs.forEach((div, optIndex) => {
            div.classList.remove('selected', 'correct', 'incorrect');
            const existingLabel = div.querySelector('.option-feedback');
            if (existingLabel) existingLabel.remove();
            if (optIndex === correctAnswer) {
                div.classList.add('correct');
                const label = document.createElement('span');
                label.className = 'option-feedback option-feedback-correct';
                label.textContent = '✓ Correct';
                div.appendChild(label);
            } else if (optIndex === userAnswer && isWrong) {
                div.classList.add('incorrect');
                const label = document.createElement('span');
                label.className = 'option-feedback option-feedback-incorrect';
                label.textContent = '✗ Your answer';
                div.appendChild(label);
            }
        });

        if (questionDiv) {
            questionDiv.classList.remove('question-wrong');
            if (isWrong) questionDiv.classList.add('question-wrong');
        }
    });
    
    // Calculate score (use same numeric comparison as above)
    questions.forEach((question, index) => {
        if (Number(userAnswers[index]) === Number(question.correct)) {
            correct++;
        }
    });
    
    const score = Math.round((correct / total) * 100);
    const passed = score >= passingScore;
    const hasExplanations = questions.some(q => q.explanation);

    const resultsDiv = document.createElement('div');
    resultsDiv.className = `quiz-results ${passed ? 'passed' : 'failed'}`;
    let resultsHtml = `
        <h3>Quiz Results</h3>
        <p>Score: ${score}% (${correct}/${total} correct)</p>
        <p>${passed ? '✅ You passed! Great job!' : '❌ You need to score at least ' + passingScore + '% to pass. Review the material and try again.'}</p>
    `;
    if (hasExplanations) {
        resultsHtml += '<div class="quiz-explanations"><h4>Why these answers?</h4><ul>';
        questions.forEach((q, i) => {
            if (q.explanation) resultsHtml += `<li><strong>Q${i + 1}:</strong> ${q.explanation}</li>`;
        });
        resultsHtml += '</ul></div>';
    }
    resultsDiv.innerHTML = resultsHtml;
    quizContainer.appendChild(resultsDiv);
    
    // Disable further interaction
    quizContainer.querySelectorAll('.option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    const submitBtn = quizContainer.querySelector('.btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = passed ? 'Quiz Passed ✓' : 'Quiz Failed - Review Required';
    }
    
    return { score, passed, correct, total };
}

// Module completion tracking
function markModuleComplete(moduleId) {
    completeModule(moduleId);
    updateProgress();
    
    // Show completion message
    const message = document.createElement('div');
    message.className = 'success';
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.padding = '1rem';
    message.style.zIndex = '1000';
    message.textContent = '✅ Module completed!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Initialize module page
function initializeModulePage(moduleId) {
    startModule(moduleId);

    var mod = findCourseModule(moduleId);
    if (isHandsOnModule(mod)) {
        document.body.classList.add('module-page--hands-on');
    }

    // Add completion button handler if exists
    const completeBtn = document.getElementById('complete-module-btn');
    if (completeBtn) {
        completeBtn.onclick = () => {
            if (confirm('Have you completed all sections, passed the quiz, and finished the assignment?')) {
                markModuleComplete(moduleId);
                completeBtn.textContent = '✓ Completed';
                completeBtn.disabled = true;
            }
        };
    }
}