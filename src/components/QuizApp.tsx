"use client";

import { useState, useEffect } from "react";
import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import ResultScreen from "./ResultScreen";
import QuestionManager from "./QuestionManager";
import { Question, QuestionType, QuizData } from "@/types/quiz";
import { getQuestions, shuffleArray, fetchQuestionsFromDB } from "@/utils/quizUtils";

export default function QuizApp() {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [questionsData, setQuestionsData] = useState<QuizData | null>(null);

  // コンポーネント初期化時にデータベースから問題を読み込み
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestionsFromDB();
      setQuestionsData(questions);
    };
    
    loadQuestions();
  }, []);

  const startQuiz = (mode: QuestionType) => {
    // questionsDataがまだ読み込まれていない場合は、localStorageから取得
    const questions = questionsData ? questionsData[mode] : getQuestions(mode);
    const shuffledQuestions = shuffleArray(questions).slice(0, 10);
    
    setCurrentQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setScreen('quiz');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setScreen('result');
    }
  };

  const answerQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }
  };

  const restartQuiz = () => {
    setScreen('start');
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
  };

  const quitQuiz = () => {
    if (confirm('テストを途中で終了しますか？')) {
      setScreen('result');
    }
  };

  return (
    <div className="relative">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 max-w-2xl w-full shadow-2xl animate-fade-in">
        {screen === 'start' && (
          <StartScreen onStartQuiz={startQuiz} />
        )}
        
        {screen === 'quiz' && currentQuestions.length > 0 && (
          <QuizScreen
            question={currentQuestions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
            onQuit={quitQuiz}
          />
        )}
        
        {screen === 'result' && (
          <ResultScreen
            correctCount={correctCount}
            totalQuestions={10}
            onRestart={restartQuiz}
          />
        )}
      </div>

      <button
        onClick={() => setShowQuestionManager(true)}
        className="fixed bottom-5 right-5 w-15 h-15 bg-orange-500 text-white rounded-full text-2xl font-bold hover:bg-orange-600 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        +
      </button>

      {showQuestionManager && (
        <QuestionManager onClose={() => setShowQuestionManager(false)} />
      )}
    </div>
  );
}