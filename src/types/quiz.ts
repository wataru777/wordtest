export interface Question {
  question: string;
  choices: string[];
  correct: number;
}

export type QuestionType = 'vocabulary' | 'proverb';

export interface QuizData {
  vocabulary: Question[];
  proverb: Question[];
}

export interface Grade {
  letter: 'S' | 'A' | 'B' | 'C';
  className: string;
  comment: string;
}