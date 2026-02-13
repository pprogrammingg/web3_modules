// Navigation and course rendering utilities

// List of modules that are actually available (have HTML files)
const AVAILABLE_MODULES = [
    'basic-01', // Blockchain Fundamentals
    'basic-02', // Consensus Algorithms
    'basic-03', // Distributed Systems
    'basic-04', // State Machines
    'basic-05', // Hyperscale-rs Overview
    'basic-05b', // Transaction Flow: User to Finality
    'basic-06', // Exploring the Hyperscale-rs Codebase
    'basic-07', // Your First Contribution
    'intermediate-01', // BFT Consensus Implementation Deep Dive
    'intermediate-02', // Sharding & Cross-Shard Transactions (general)
    'intermediate-03', // Cross-Shard Transactions in Hyperscale-rs
    'intermediate-04', // Transaction Execution & Radix Engine
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
            html += `<h3 class="level-heading">${level.charAt(0).toUpperCase() + level.slice(1)} Level</h3>`;
            byLevel[level].forEach(module => {
                const status = getModuleStatus(module.id);
                html += renderModuleCard(module, status);
            });
        }
    });
    
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
    
    // Check answers and highlight correct/incorrect options and wrong-answered questions
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correct;
        const isWrong = userAnswer !== correctAnswer;
        const optionDivs = quizContainer.querySelectorAll(`[data-question="${index}"]`);
        const questionDiv = quizContainer.querySelectorAll('.question')[index];

        optionDivs.forEach((div, optIndex) => {
            div.classList.remove('selected', 'correct', 'incorrect');
            if (optIndex === correctAnswer) {
                div.classList.add('correct');
            } else if (optIndex === userAnswer && isWrong) {
                div.classList.add('incorrect');
            }
        });

        if (questionDiv) {
            questionDiv.classList.remove('question-wrong');
            if (isWrong) questionDiv.classList.add('question-wrong');
        }
    });
    
    // Calculate score
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
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