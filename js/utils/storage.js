export class StorageManager {
    static loadCustomQuestions() {
        const saved = localStorage.getItem('allQuestions');
        return saved ? JSON.parse(saved) : null;
    }

    static saveQuestions(questions) {
        localStorage.setItem('allQuestions', JSON.stringify(questions));
    }
}