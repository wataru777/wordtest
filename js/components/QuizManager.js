import { shuffleArray } from '../utils/shuffle.js';
import { originalQuestions } from '../data/questions.js';
import { StorageManager } from '../utils/storage.js';

export class QuizManager {
    constructor() {
        this.questions = JSON.parse(JSON.stringify(originalQuestions));
        this.currentMode = '';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.answeredQuestions = [];
        
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

    startQuiz(mode) {
        this.currentMode = mode;
        this.currentQuestions = shuffleArray(this.questions[mode]).slice(0, 10);
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.answeredQuestions = [];
        
        return this.currentQuestions;
    }

    getCurrentQuestion() {
        return this.currentQuestions[this.currentQuestionIndex];
    }

    checkAnswer(choiceIndex) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = choiceIndex === question.correct;
        
        if (isCorrect) {
            this.correctCount++;
        }
        
        return isCorrect;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        return this.currentQuestionIndex < 10;
    }

    getResult() {
        const score = this.correctCount;
        let grade, comment;
        
        if (score >= 9) {
            grade = 'S';
            comment = 'すばらしい！完璧に近い成績です！\n日頃の勉強の成果が出ていますね。';
        } else if (score >= 7) {
            grade = 'A';
            comment = 'よくできました！\nもう少しで完璧です。この調子で頑張りましょう！';
        } else if (score >= 5) {
            grade = 'B';
            comment = 'まずまずの成績です。\n間違えた問題を復習して、次はAを目指しましょう！';
        } else {
            grade = 'C';
            comment = 'もう少し頑張りましょう。\n毎日少しずつ勉強すれば、必ず上達します！';
        }
        
        return { score, grade, comment };
    }

    getCurrentProgress() {
        return {
            currentIndex: this.currentQuestionIndex,
            total: 10,
            score: this.correctCount
        };
    }
}