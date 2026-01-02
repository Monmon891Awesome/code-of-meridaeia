// Interactive Code Exercise Handler
// Handles code-typing, code-completion, fix-bug, and build-from-scratch questions

class CodeExerciseHandler {
    constructor(game) {
        this.game = game;
        this.currentQuestion = null;
        this.userCode = '';
        this.testResults = [];
    }

    // Render the appropriate UI based on question type
    renderQuestion(question) {
        this.currentQuestion = question;
        const container = document.getElementById('question-text');

        switch (question.type) {
            case 'code-typing':
                return this.renderCodeTyping(question);
            case 'code-completion':
                return this.renderCodeCompletion(question);
            case 'fix-bug':
                return this.renderFixBug(question);
            case 'build-from-scratch':
                return this.renderBuildFromScratch(question);
            default:
                return this.renderMultipleChoice(question);
        }
    }

    // CODE TYPING: Fill in the blanks
    renderCodeTyping(question) {
        const parts = question.template.split('___');
        let html = '<div class="code-typing-container">';
        html += `<p class="question-prompt">${question.question}</p>`;
        html += '<div class="code-template">';

        parts.forEach((part, index) => {
            html += `<span>${part}</span>`;
            if (index < question.blanks.length) {
                const blank = question.blanks[index];
                html += `<input type="text" 
                               class="code-input" 
                               id="blank-${index}" 
                               data-blank-index="${index}"
                               placeholder="..."
                               autocomplete="off">`;
            }
        });

        html += '</div>';
        html += '<div class="typing-progress">';
        question.blanks.forEach((_, i) => {
            html += `<div class="blank-indicator" id="indicator-${i}"></div>`;
        });
        html += '</div>';
        html += '<div class="code-actions">';
        html += '<button class="btn-run-code" onclick="codeExercise.checkCodeTyping()">✓ Check Answer</button>';
        html += '<button class="btn-hint" onclick="game.showHint()">💡 Hint (10 gold)</button>';
        html += '</div>';
        html += '<div id="code-feedback"></div>';
        html += '</div>';

        return html;
    }

    // CODE COMPLETION: Fill in larger code blocks
    renderCodeCompletion(question) {
        let html = '<div class="code-editor-container">';
        html += `<p class="question-prompt">${question.question}</p>`;
        html += `<textarea class="code-editor" id="code-editor" placeholder="Type your code here...">${question.template}</textarea>`;
        html += '<div class="code-actions">';
        html += '<button class="btn-run-code" onclick="codeExercise.checkCodeCompletion()">▶ Run Tests</button>';
        html += '<button class="btn-hint" onclick="game.showHint()">💡 Hint (10 gold)</button>';
        html += '<button class="btn-reset" onclick="codeExercise.resetCode()">↻ Reset</button>';
        html += '</div>';
        html += '<div class="test-results" id="test-results"></div>';
        html += '<div id="code-feedback"></div>';
        html += '</div>';

        return html;
    }

    // FIX BUG: Find and fix syntax errors
    renderFixBug(question) {
        let html = '<div class="bug-hunt-container">';
        html += `<p class="question-prompt">${question.question}</p>`;
        html += '<div class="broken-code">';
        html += '<div class="error-indicator">❌ Error</div>';
        html += '<pre><code>';

        const lines = question.brokenCode.split('\n');
        lines.forEach((line, index) => {
            const isErrorLine = index === question.errorLine - 1;
            html += `<div class="${isErrorLine ? 'error-line' : ''}">${line}</div>`;
        });

        html += '</code></pre>';
        html += '</div>';
        html += `<p class="error-message">⚠️ ${question.errorMessage}</p>`;
        html += `<textarea class="code-editor" id="code-editor" placeholder="Fix the code here...">${question.brokenCode}</textarea>`;
        html += '<div class="code-actions">';
        html += '<button class="btn-run-code" onclick="codeExercise.checkFixBug()">✓ Check Fix</button>';
        html += '<button class="btn-hint" onclick="game.showHint()">💡 Hint (10 gold)</button>';
        html += '</div>';
        html += '<div id="code-feedback"></div>';
        html += '</div>';

        return html;
    }

    // BUILD FROM SCRATCH: Write complete code
    renderBuildFromScratch(question) {
        let html = '<div class="code-editor-container">';
        html += `<p class="question-prompt">${question.question}</p>`;
        html += `<textarea class="code-editor" id="code-editor" rows="15">${question.starterCode}</textarea>`;

        if (question.testCases) {
            html += '<div class="test-requirements">';
            html += '<h4>Requirements:</h4>';
            html += '<ul>';
            question.testCases.forEach(test => {
                html += `<li>${test.description}</li>`;
            });
            html += '</ul>';
            html += '</div>';
        }

        html += '<div class="code-actions">';
        html += '<button class="btn-run-code" onclick="codeExercise.runTests()">▶ Run Tests</button>';
        html += '<button class="btn-hint" onclick="game.showHint()">💡 Hint (10 gold)</button>';
        html += '<button class="btn-reset" onclick="codeExercise.resetCode()">↻ Reset</button>';
        html += '</div>';
        html += '<div class="test-results" id="test-results"></div>';
        html += '<div id="code-feedback"></div>';
        html += '</div>';

        return html;
    }

    // VALIDATION METHODS

    checkCodeTyping() {
        const question = this.currentQuestion;
        let allCorrect = true;

        question.blanks.forEach((blank, index) => {
            const input = document.getElementById(`blank-${index}`);
            const userAnswer = input.value.trim();
            const correctAnswers = [blank.correctAnswer, ...blank.alternatives];
            const isCorrect = correctAnswers.includes(userAnswer);

            input.classList.remove('correct', 'incorrect');
            input.classList.add(isCorrect ? 'correct' : 'incorrect');

            const indicator = document.getElementById(`indicator-${index}`);
            indicator.classList.toggle('filled', isCorrect);

            if (!isCorrect) allCorrect = false;
        });

        this.showFeedback(allCorrect);

        if (allCorrect) {
            setTimeout(() => this.game.handleCorrectAnswer(), 1500);
        }
    }

    checkCodeCompletion() {
        const userCode = document.getElementById('code-editor').value;
        const question = this.currentQuestion;

        // Simple validation: check if blanks are filled
        const hasAllBlanks = question.blanks.every(blank => {
            return userCode.includes(blank.correctAnswer) ||
                blank.alternatives.some(alt => userCode.includes(alt));
        });

        this.showFeedback(hasAllBlanks);

        if (hasAllBlanks) {
            setTimeout(() => this.game.handleCorrectAnswer(), 1500);
        }
    }

    checkFixBug() {
        const userCode = document.getElementById('code-editor').value;
        const question = this.currentQuestion;

        // Check if user's code matches the correct code (ignoring whitespace)
        const userClean = userCode.replace(/\s+/g, '');
        const correctClean = question.correctCode.replace(/\s+/g, '');
        const isCorrect = userClean === correctClean;

        this.showFeedback(isCorrect);

        if (isCorrect) {
            setTimeout(() => this.game.handleCorrectAnswer(), 1500);
        }
    }

    runTests() {
        const userCode = document.getElementById('code-editor').value;
        const question = this.currentQuestion;
        const resultsContainer = document.getElementById('test-results');

        // For demo purposes, we'll do simple pattern matching
        // In production, you'd send to a server for safe execution
        let allPassed = true;
        let html = '<h4>Test Results:</h4>';

        question.testCases.forEach((test, index) => {
            // Simple check: does the code contain the solution pattern?
            const passed = userCode.includes(question.solution.trim());
            allPassed = allPassed && passed;

            html += `<div class="test-case ${passed ? 'passed' : 'failed'}">`;
            html += `<span class="test-icon">${passed ? '✓' : '✗'}</span>`;
            html += `<span class="test-description">${test.description}</span>`;
            html += '</div>';
        });

        resultsContainer.innerHTML = html;
        this.showFeedback(allPassed);

        if (allPassed) {
            setTimeout(() => this.game.handleCorrectAnswer(), 2000);
        }
    }

    showFeedback(isCorrect) {
        const feedback = document.getElementById('code-feedback');
        feedback.className = `code-feedback ${isCorrect ? 'success' : 'error'}`;

        if (isCorrect) {
            feedback.innerHTML = `
                <span class="code-feedback-icon">🎉</span>
                <strong>Correct!</strong> ${this.currentQuestion.explanation}
            `;
        } else {
            feedback.innerHTML = `
                <span class="code-feedback-icon">❌</span>
                <strong>Not quite.</strong> Try again or use a hint!
            `;
        }
    }

    resetCode() {
        const editor = document.getElementById('code-editor');
        if (editor) {
            editor.value = this.currentQuestion.starterCode || this.currentQuestion.template;
        }
        document.getElementById('test-results').innerHTML = '';
        document.getElementById('code-feedback').innerHTML = '';
    }

    // For traditional multiple choice
    renderMultipleChoice(question) {
        // Use existing game logic
        return this.game.renderTraditionalQuestion(question);
    }
}

// Initialize globally
let codeExercise;

// Add to game initialization
document.addEventListener('DOMContentLoaded', () => {
    // Wait for game to be initialized
    setTimeout(() => {
        if (typeof game !== 'undefined') {
            codeExercise = new CodeExerciseHandler(game);
        }
    }, 100);
});
