export interface Question {
  id: string;
  question: string;
  choices: string[];
  correct: number;
}

export type QuestionType = 'vocabulary' | 'proverb' | 'wago';

export interface QuizData {
  vocabulary: Question[];
  proverb: Question[];
  wago: Question[];
}

export interface Grade {
  letter: 'S' | 'A' | 'B' | 'C';
  className: string;
  comment: string;
}