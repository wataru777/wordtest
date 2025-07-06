import { QuizManager } from './components/QuizManager.js';
import { QuestionManager } from './components/QuestionManager.js';
import { UIController } from './components/UIController.js';
import { originalQuestions } from './data/questions.js';

class WordTestApp {
    constructor() {
        this.quizManager = new QuizManager();
        this.questionManager = new QuestionManager();
        this.uiController = new UIController();
        
        this.initializeEventListeners();
        this.uiController.setAnswerCallback(this.handleAnswer.bind(this));
        
        window.startQuiz = this.startQuiz.bind(this);
        window.nextQuestion = this.nextQuestion.bind(this);
        window.restartQuiz = this.restartQuiz.bind(this);
        window.showQuestionManager = this.showQuestionManager.bind(this);
        window.hideQuestionManager = this.hideQuestionManager.bind(this);
        window.switchTab = this.switchTab.bind(this);
        window.setChoiceCount = this.setChoiceCount.bind(this);
        window.loadQuestionsForManagement = this.loadQuestionsForManagement.bind(this);
        window.editQuestion = this.editQuestion.bind(this);
        window.deleteQuestion = this.deleteQuestion.bind(this);
    }

    initializeEventListeners() {
        document.getElementById('addQuestionForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        document.getElementById('questionManagerModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideQuestionManager();
            }
        });
    }

    startQuiz(mode) {
        this.quizManager.startQuiz(mode);
        this.uiController.showQuizScreen();
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.quizManager.getCurrentQuestion();
        const progress = this.quizManager.getCurrentProgress();
        this.uiController.displayQuestion(question, progress.currentIndex);
    }

    handleAnswer(choiceIndex, buttonElement) {
        const question = this.quizManager.getCurrentQuestion();
        const isCorrect = this.quizManager.checkAnswer(choiceIndex);
        
        if (isCorrect) {
            buttonElement.classList.add('correct');
        } else {
            buttonElement.classList.add('incorrect');
        }
        
        this.uiController.showFeedback(isCorrect, question);
    }

    nextQuestion() {
        this.uiController.clearFeedback();
        
        if (this.quizManager.nextQuestion()) {
            this.showCurrentQuestion();
        } else {
            this.showResult();
        }
    }

    showResult() {
        const result = this.quizManager.getResult();
        this.uiController.showResultScreen();
        this.uiController.displayResult(result);
    }

    restartQuiz() {
        this.uiController.showStartScreen();
    }

    showQuestionManager() {
        this.uiController.showQuestionManager();
        this.switchTab('add');
    }

    hideQuestionManager() {
        this.uiController.hideQuestionManager();
        this.questionManager.resetEditingIndex();
        this.setChoiceCount(4);
    }

    switchTab(tab) {
        this.uiController.switchTab(tab);
        if (tab === 'manage') {
            this.loadQuestionsForManagement();
        }
    }

    setChoiceCount(count) {
        this.questionManager.setChoiceCount(count);
        this.uiController.updateChoiceCountUI(count);
    }

    loadQuestionsForManagement() {
        const type = document.getElementById('manageQuestionType').value;
        const questions = this.questionManager.getQuestions(type);
        this.uiController.loadQuestionsForManagement(questions, originalQuestions, type);
    }

    editQuestion(type, index) {
        const question = this.questionManager.getQuestions(type)[index];
        this.questionManager.setEditingIndex(index);
        
        this.switchTab('add');
        
        const choiceCount = question.choices.length;
        this.setChoiceCount(choiceCount);
        this.uiController.populateEditForm(type, question, choiceCount);
    }

    deleteQuestion(type, index) {
        if (confirm('この問題を削除してもよろしいですか？')) {
            this.questionManager.deleteQuestion(type, index);
            this.loadQuestionsForManagement();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const type = document.getElementById('questionType').value;
        const questionData = {
            question: document.getElementById('questionTextInput').value,
            correctAnswer: document.getElementById('correctAnswer').value,
            wrongAnswers: [
                document.getElementById('wrongAnswer1').value,
                document.getElementById('wrongAnswer2').value
            ]
        };
        
        if (this.questionManager.getChoiceCount() === 4) {
            questionData.wrongAnswers.push(document.getElementById('wrongAnswer3').value);
        }
        
        const editingIndex = this.questionManager.getEditingIndex();
        
        if (editingIndex !== -1) {
            this.questionManager.updateQuestion(type, editingIndex, questionData);
            alert('問題を更新しました！');
        } else {
            this.questionManager.addQuestion(type, questionData);
            alert('問題を追加しました！');
        }
        
        this.quizManager.loadCustomQuestions();
        this.hideQuestionManager();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordTestApp();
});