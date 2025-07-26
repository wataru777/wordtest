import { Question, QuestionType, QuizData, Grade } from '@/types/quiz';

const originalQuestions: QuizData = {
  vocabulary: [],
  wago: [],
  proverb: []
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getQuestions(type: QuestionType): Question[] {
  if (typeof window === 'undefined') {
    return originalQuestions[type];
  }
  
  const saved = localStorage.getItem('allQuestions');
  if (saved) {
    try {
      const savedQuestions = JSON.parse(saved);
      return savedQuestions[type] || originalQuestions[type];
    } catch {
      return originalQuestions[type];
    }
  }
  return originalQuestions[type];
}

export function saveQuestions(questions: QuizData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('allQuestions', JSON.stringify(questions));
  }
}

// 削除された初期問題のIDを管理する関数
export function saveDeletedOriginalQuestions(deletedQuestions: {vocabulary: number[], proverb: number[], wago: number[]}): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('deletedOriginalQuestions', JSON.stringify(deletedQuestions));
  }
}

export function getDeletedOriginalQuestions(): {vocabulary: number[], proverb: number[], wago: number[]} {
  if (typeof window === 'undefined') {
    return { vocabulary: [], proverb: [], wago: [] };
  }
  
  const saved = localStorage.getItem('deletedOriginalQuestions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        vocabulary: parsed.vocabulary || [],
        proverb: parsed.proverb || [],
        wago: parsed.wago || []
      };
    } catch {
      return { vocabulary: [], proverb: [], wago: [] };
    }
  }
  return { vocabulary: [], proverb: [], wago: [] };
}

export function getGrade(correctCount: number, totalQuestions: number): Grade {
  const percentage = correctCount / totalQuestions;
  
  if (percentage >= 0.9) {
    return {
      letter: 'S',
      className: 'text-yellow-500',
      comment: 'すばらしい！完璧に近い成績です！\n日頃の勉強の成果が出ていますね。'
    };
  } else if (percentage >= 0.7) {
    return {
      letter: 'A',
      className: 'text-red-500',
      comment: 'よくできました！\nもう少しで完璧です。この調子で頑張りましょう！'
    };
  } else if (percentage >= 0.5) {
    return {
      letter: 'B',
      className: 'text-blue-500',
      comment: 'まずまずの成績です。\n間違えた問題を復習して、次はAを目指しましょう！'
    };
  } else {
    return {
      letter: 'C',
      className: 'text-green-500',
      comment: 'もう少し頑張りましょう。\n毎日少しずつ勉強すれば、必ず上達します！'
    };
  }
}

export function getAllQuestions(): QuizData {
  if (typeof window === 'undefined') {
    return originalQuestions;
  }
  
  const saved = localStorage.getItem('allQuestions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return originalQuestions;
    }
  }
  return originalQuestions;
}

// データベースから問題を取得する関数
export async function fetchQuestionsFromDB(): Promise<QuizData> {
  try {
    const [vocabularyResponse, proverbResponse, wagoResponse] = await Promise.all([
      fetch('/api/questions?type=vocabulary'),
      fetch('/api/questions?type=proverb'),
      fetch('/api/questions?type=wago')
    ]);

    if (!vocabularyResponse.ok || !proverbResponse.ok || !wagoResponse.ok) {
      throw new Error('Failed to fetch questions from database');
    }

    const vocabularyQuestions = await vocabularyResponse.json();
    const proverbQuestions = await proverbResponse.json();
    const wagoQuestions = await wagoResponse.json();

    // 削除された初期問題を取得
    const deletedOriginal = getDeletedOriginalQuestions();
    
    // 削除されていない初期問題のみを含める
    const filteredOriginalVocabulary = originalQuestions.vocabulary.filter((_, index) => 
      !deletedOriginal.vocabulary.includes(index)
    );
    const filteredOriginalProverb = originalQuestions.proverb.filter((_, index) => 
      !deletedOriginal.proverb.includes(index)
    );
    const filteredOriginalWago = originalQuestions.wago.filter((_, index) => 
      !deletedOriginal.wago.includes(index)
    );
    
    // データベースから取得した問題と削除されていない元の問題をマージ
    const mergedQuestions: QuizData = {
      vocabulary: [...filteredOriginalVocabulary, ...vocabularyQuestions],
      proverb: [...filteredOriginalProverb, ...proverbQuestions],
      wago: [...filteredOriginalWago, ...wagoQuestions]
    };

    // localStorageも更新
    saveQuestions(mergedQuestions);
    
    return mergedQuestions;
  } catch (error) {
    console.error('Error fetching questions from database:', error);
    // エラーの場合は元の問題とlocalStorageの内容を返す
    return getAllQuestions();
  }
}

export function getOriginalQuestions(): QuizData {
  return originalQuestions;
}

export function parseCsv(csvText: string): Question[] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const questions: Question[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;
    
    const columns = line.split(',').map(col => col.trim());
    
    if (columns.length < 4) {
      throw new Error(`行 ${i + 1}: 最低4列必要です (問題文、正解、不正解1、不正解2)`);
    }
    
    const question: Question = {
      question: columns[0],
      choices: [columns[1], columns[2], columns[3]],
      correct: 0
    };
    
    // 4択の場合は5番目の列を追加
    if (columns.length >= 5 && columns[4].trim() !== '') {
      question.choices.push(columns[4]);
    }
    
    questions.push(question);
  }
  
  return questions;
}