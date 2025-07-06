import { originalQuestions } from '../data/questions.js';
import { StorageManager } from '../utils/storage.js';

export class QuestionManager {
    constructor() {
        this.questions = JSON.parse(JSON.stringify(originalQuestions));
        this.choiceCount = 4;
        this.editingIndex = -1;
        
        this.loadCustomQuestions();
    }

    loadCustomQuestions() {
        const saved = StorageManager.loadCustomQuestions();
        if (saved) {
            Object.keys(saved).forEach(type => {
                this.questions[type] = saved[type];
            });
        }
    }

    getQuestions(type) {
        return this.questions[type] || [];
    }

    addQuestion(type, questionData) {
        if (!this.questions[type]) {
            this.questions[type] = [];
        }
        
        const newQuestion = {
            question: questionData.question,
            choices: [questionData.correctAnswer, ...questionData.wrongAnswers],
            correct: 0
        };
        
        this.questions[type].push(newQuestion);
        this.saveQuestions();
        return true;
    }

    updateQuestion(type, index, questionData) {
        if (!this.questions[type] || index >= this.questions[type].length) {
            return false;
        }
        
        const updatedQuestion = {
            question: questionData.question,
            choices: [questionData.correctAnswer, ...questionData.wrongAnswers],
            correct: 0
        };
        
        this.questions[type][index] = updatedQuestion;
        this.saveQuestions();
        return true;
    }

    deleteQuestion(type, index) {
        if (!this.questions[type] || index >= this.questions[type].length) {
            return false;
        }
        
        this.questions[type].splice(index, 1);
        this.saveQuestions();
        return true;
    }

    isOriginalQuestion(type, index) {
        return index < originalQuestions[type].length && 
               JSON.stringify(this.questions[type][index]) === JSON.stringify(originalQuestions[type][index]);
    }

    saveQuestions() {
        StorageManager.saveQuestions(this.questions);
    }

    setChoiceCount(count) {
        this.choiceCount = count;
    }

    getChoiceCount() {
        return this.choiceCount;
    }

    setEditingIndex(index) {
        this.editingIndex = index;
    }

    getEditingIndex() {
        return this.editingIndex;
    }

    resetEditingIndex() {
        this.editingIndex = -1;
    }
}