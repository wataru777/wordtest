import { shuffleArray } from '../utils/shuffle.js';

export class UIController {
    constructor() {
        this.feedbackOverlay = document.getElementById('feedbackOverlay');
        this.nextButton = document.getElementById('nextButton');
    }

    showStartScreen() {
        this.hideAllScreens();
        document.getElementById('startScreen').style.display = 'block';
    }

    showQuizScreen() {
        this.hideAllScreens();
        document.getElementById('quizScreen').style.display = 'block';
    }

    showResultScreen() {
        this.hideAllScreens();
        document.getElementById('resultScreen').style.display = 'block';
    }

    hideAllScreens() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('quizScreen').style.display = 'none';
        document.getElementById('resultScreen').style.display = 'none';
    }

    displayQuestion(question, questionIndex) {
        document.getElementById('questionNumber').textContent = 
            `問題 ${questionIndex + 1} / 10`;
        
        let questionHtml = question.question;
        questionHtml = questionHtml.replace(/\[\[(.*?)\]\]/g, '<span class="underline">$1</span>');
        document.getElementById('questionText').innerHTML = questionHtml;
        
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';
        
        const shuffledIndices = shuffleArray([0, 1, 2, 3].slice(0, question.choices.length));
        
        shuffledIndices.forEach((originalIndex, displayIndex) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = `${displayIndex + 1}. ${question.choices[originalIndex]}`;
            button.onclick = () => this.onChoiceClick(originalIndex, button);
            choicesContainer.appendChild(button);
        });
    }

    onChoiceClick(choiceIndex, buttonElement) {
        if (this.onAnswerCallback) {
            this.onAnswerCallback(choiceIndex, buttonElement);
        }
    }

    setAnswerCallback(callback) {
        this.onAnswerCallback = callback;
    }

    showFeedback(isCorrect, question) {
        const buttons = document.querySelectorAll('.choice-button');
        
        buttons.forEach(btn => {
            btn.classList.add('disabled');
            btn.onclick = null;
        });
        
        const feedbackCircle = document.createElement('div');
        feedbackCircle.className = 'feedback-circle';
        
        if (isCorrect) {
            feedbackCircle.classList.add('correct');
            feedbackCircle.textContent = '○';
        } else {
            feedbackCircle.classList.add('incorrect');
            feedbackCircle.textContent = '×';
            
            buttons.forEach((btn) => {
                if (question.choices[question.correct] === btn.textContent.substring(3)) {
                    btn.classList.add('correct');
                }
            });
        }
        
        this.feedbackOverlay.appendChild(feedbackCircle);
        
        setTimeout(() => {
            this.nextButton.classList.add('show');
        }, 800);
    }

    clearFeedback() {
        this.feedbackOverlay.innerHTML = '';
        this.nextButton.classList.remove('show');
    }

    displayResult(result) {
        const scoreElement = document.getElementById('score');
        const gradeElement = document.getElementById('grade');
        const commentElement = document.getElementById('comment');
        
        scoreElement.textContent = `${result.score} / 10 問正解`;
        gradeElement.textContent = result.grade;
        gradeElement.className = `grade ${result.grade.toLowerCase()}`;
        commentElement.textContent = result.comment;
    }

    showQuestionManager() {
        document.getElementById('questionManagerModal').style.display = 'flex';
    }

    hideQuestionManager() {
        document.getElementById('questionManagerModal').style.display = 'none';
        document.getElementById('addQuestionForm').reset();
    }

    switchTab(tab) {
        const addTab = document.getElementById('addQuestionTab');
        const manageTab = document.getElementById('manageQuestionsTab');
        const tabButtons = document.querySelectorAll('.tab-button');
        
        if (tab === 'add') {
            addTab.style.display = 'block';
            manageTab.style.display = 'none';
            tabButtons[0].classList.add('active');
            tabButtons[1].classList.remove('active');
        } else {
            addTab.style.display = 'none';
            manageTab.style.display = 'block';
            tabButtons[0].classList.remove('active');
            tabButtons[1].classList.add('active');
        }
    }

    updateChoiceCountUI(count) {
        const buttons = document.querySelectorAll('.choice-type-button');
        const wrongAnswer3Group = document.getElementById('wrongAnswer3Group');
        
        buttons.forEach(btn => btn.classList.remove('active'));
        if (count === 3) {
            buttons[0].classList.add('active');
            wrongAnswer3Group.style.display = 'none';
            document.getElementById('wrongAnswer3').removeAttribute('required');
        } else {
            buttons[1].classList.add('active');
            wrongAnswer3Group.style.display = 'block';
            document.getElementById('wrongAnswer3').setAttribute('required', 'required');
        }
    }

    loadQuestionsForManagement(questions, originalQuestions, type) {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        if (questions && questions.length > 0) {
            questions.forEach((question, index) => {
                const item = document.createElement('div');
                item.className = 'question-item';
                
                const isOriginal = index < originalQuestions[type].length && 
                    JSON.stringify(question) === JSON.stringify(originalQuestions[type][index]);
                
                item.innerHTML = `
                    <div class="question-text">
                        ${question.question.replace(/\[\[(.*?)\]\]/g, '$1')}
                        ${isOriginal ? '<span style="color: #718096; font-size: 0.8em;"> (初期問題)</span>' : ''}
                    </div>
                    <div class="question-actions">
                        <button class="edit-button" onclick="editQuestion('${type}', ${index})">編集</button>
                        <button class="delete-button" onclick="deleteQuestion('${type}', ${index})">削除</button>
                    </div>
                `;
                questionList.appendChild(item);
            });
        } else {
            questionList.innerHTML = '<p style="text-align: center; color: #718096;">問題がありません</p>';
        }
    }

    populateEditForm(type, question, choiceCount) {
        document.getElementById('questionType').value = type;
        document.getElementById('questionTextInput').value = question.question;
        document.getElementById('correctAnswer').value = question.choices[0];
        document.getElementById('wrongAnswer1').value = question.choices[1];
        document.getElementById('wrongAnswer2').value = question.choices[2];
        
        if (choiceCount === 3) {
            document.getElementById('wrongAnswer3').value = '';
        } else {
            document.getElementById('wrongAnswer3').value = question.choices[3];
        }
    }
}