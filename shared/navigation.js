// Navigation and course rendering utilities

// List of modules that are actually available (have HTML files)
const AVAILABLE_MODULES = [
    'basic-01', // Blockchain Fundamentals
    'basic-02', // Consensus Algorithms
    'basic-04', // State Machines
    'basic-05', // Hyperscale-rs Overview
];

function isModuleAvailable(moduleId) {
    return AVAILABLE_MODULES.includes(moduleId);
}

function initializeCourseIndex() {
    renderModules();
    updateProgress();
}

function renderModules() {
    const levels = ['basic', 'intermediate', 'advanced'];
    
    levels.forEach(level => {
        const container = document.getElementById(`${level}-modules`);
        if (!container) return;
        
        const levelData = COURSE_DATA.levels[level];
        if (!levelData) return;
        
        let html = '';
        levelData.modules.forEach(module => {
            const status = getModuleStatus(module.id);
            html += renderModuleCard(module, status);
        });
        
        container.innerHTML = html;
    });
    
    // Render hyperscale-rs specific modules
    renderHyperscaleModules();
}

function renderHyperscaleModules() {
    const container = document.getElementById('hyperscale-modules');
    if (!container) return;
    
    const hyperscaleModules = getHyperscaleModules();
    let html = '';
    
    // Group by level
    const byLevel = {
        basic: [],
        intermediate: [],
        advanced: []
    };
    
    hyperscaleModules.forEach(module => {
        for (const level in COURSE_DATA.levels) {
            if (COURSE_DATA.levels[level].modules.find(m => m.id === module.id)) {
                byLevel[level].push(module);
                break;
            }
        }
    });
    
    ['basic', 'intermediate', 'advanced'].forEach(level => {
        if (byLevel[level].length > 0) {
            html += `<h3 style="margin-top: 2rem; color: var(--primary-color);">${level.charAt(0).toUpperCase() + level.slice(1)} Level</h3>`;
            byLevel[level].forEach(module => {
                const status = getModuleStatus(module.id);
                html += renderModuleCard(module, status);
            });
        }
    });
    
    container.innerHTML = html;
}

function renderModuleCard(module, status) {
    const isAvailable = isModuleAvailable(module.id);
    const statusClass = status === 'completed' ? 'completed' : 
                        status === 'in-progress' ? 'in-progress' : '';
    const statusText = status === 'completed' ? 'Completed' : 
                      status === 'in-progress' ? 'In Progress' : 'Not Started';
    const statusClassBadge = status === 'completed' ? 'status-completed' : 
                            status === 'in-progress' ? 'status-in-progress' : 'status-pending';
    
    const badge = module.hyperscaleSpecific ? '<span class="badge-hyperscale">Hyperscale-rs</span>' : '';
    const availableBadge = isAvailable ? '<span class="badge-available">✓ Available</span>' : '<span class="badge-coming">Coming Soon</span>';
    const cardClass = isAvailable ? `module-card available ${statusClass}` : `module-card unavailable ${statusClass}`;
    const href = isAvailable ? module.path : '#';
    const onClick = isAvailable ? '' : 'onclick="event.preventDefault(); return false;"';
    
    return `
        <a href="${href}" ${onClick} class="${cardClass}">
            <h3 class="module-title-with-badges">${module.title}${badge}${availableBadge}</h3>
            <p>${module.description}</p>
            <div class="module-meta">
                <span>${module.duration} • ${module.difficulty}</span>
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
    submitBtn.style.marginTop = '1rem';
    submitBtn.onclick = () => submitQuiz(quizId, questions, userAnswers, passingScore);
    quizContainer.appendChild(submitBtn);
    
    // Handle option selection
    quizContainer.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            if (quizSubmitted) return;
            
            const questionIndex = parseInt(this.dataset.question);
            const optionIndex = parseInt(this.dataset.option);
            
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
    
    // Check answers
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correct;
        const optionDivs = quizContainer.querySelectorAll(`[data-question="${index}"]`);
        
        optionDivs.forEach((div, optIndex) => {
            div.classList.remove('selected', 'correct', 'incorrect');
            if (optIndex === correctAnswer) {
                div.classList.add('correct');
            } else if (optIndex === userAnswer && userAnswer !== correctAnswer) {
                div.classList.add('incorrect');
            }
        });
    });
    
    // Calculate score
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correct++;
        }
    });
    
    const score = Math.round((correct / total) * 100);
    const passed = score >= passingScore;
    
    // Show results
    const resultsDiv = document.createElement('div');
    resultsDiv.className = `quiz-results ${passed ? 'passed' : 'failed'}`;
    resultsDiv.innerHTML = `
        <h3>Quiz Results</h3>
        <p>Score: ${score}% (${correct}/${total} correct)</p>
        <p>${passed ? '✅ You passed! Great job!' : '❌ You need to score at least ' + passingScore + '% to pass. Review the material and try again.'}</p>
    `;
    
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