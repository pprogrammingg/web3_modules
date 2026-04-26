// Navigation and course rendering utilities

// List of modules that are actually available (have HTML files)
const AVAILABLE_MODULES = [
    'basic-01', // Blockchain Fundamentals
    'basic-02', // Consensus Algorithms
    'basic-03', // Distributed Systems
    'basic-04', // State Machines
    'intermediate-hs-overview', // Hyperscale-rs Overview & Setup
    'basic-05b', // Transaction Flow (only Hyperscale basic)
    'basic-06', // Your First Contribution: Documentation & Tests
    'intermediate-hs-crate-groups', // Crate Groups
    'intermediate-01', // BFT Consensus Implementation Deep Dive
    'intermediate-02', // Sharding & Cross-Shard Transactions (general)
    'intermediate-03', // Cross-Shard Transactions in Hyperscale-rs
    'intermediate-04', // Transaction Execution & Radix Engine
    'intermediate-08', // Cryptography in Hyperscale-rs
    'intermediate-timing', // Timing: Rounds, Heights, Timeouts & Timers
    'intermediate-performance', // Performance Measurement
    'intermediate-e2e-tests', // End-to-End Tests (sim & production)
    'intermediate-project-01', // Hands-On Project 1: E2E observability
    'basic-07', // libp2p basic
    'intermediate-libp2p', // libp2p intermediate
    'advanced-libp2p', // libp2p advanced
];

function isModuleAvailable(moduleId) {
    return AVAILABLE_MODULES.includes(moduleId);
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
    if (!rows.length) return 11;
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
            container.innerHTML = renderCourseLevelGroups(levelData.modules, 2, 6);
            return;
        }
        if (level === 'advanced') {
            container.innerHTML = renderCourseLevelGroups(levelData.modules, 7, 11);
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

    const isProject = module.kind === 'project';
    const projectBadge = isProject ? '<span class="badge-project">Hands-on project</span>' : '';
    const badge = module.hyperscaleSpecific ? '<span class="badge-hyperscale">Hyperscale-rs</span>' : '';
    const availableBadge = isAvailable ? '<span class="badge-available">✓ Available</span>' : '<span class="badge-coming">Coming Soon</span>';
    const projectCardClass = isProject ? ' module-card--project' : '';
    const cardClass = isAvailable
        ? `module-card available ${statusClass}${projectCardClass}`
        : `module-card unavailable ${statusClass}${projectCardClass}`;
    const href = isAvailable ? module.path : '#';
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
            <h3 class="module-title-with-badges">${module.title}${projectBadge}${badge}${availableBadge}</h3>
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