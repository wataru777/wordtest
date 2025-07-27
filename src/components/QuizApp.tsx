"use client";

import { useState, useEffect } from "react";
import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import ResultScreen from "./ResultScreen";
import QuestionManager from "./QuestionManager";
import DebugPanel from "./DebugPanel";
import VersionLabel from "./VersionLabel";
import StatisticsScreen from "./StatisticsScreen";
import { Question, QuestionType, QuizData } from "@/types/quiz";
import { getQuestions, shuffleArray, fetchQuestionsFromDB } from "@/utils/quizUtils";

export default function QuizApp() {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'result' | 'statistics'>('start');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [questionsData, setQuestionsData] = useState<QuizData | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [currentQuizType, setCurrentQuizType] = useState<QuestionType>('vocabulary');

  // コンポーネント初期化時にデータベースから問題を読み込み
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestionsFromDB();
      setQuestionsData(questions);
    };
    
    loadQuestions();

    // デバッグモードの初期状態を取得
    const savedDebugMode = localStorage.getItem('debugMode') === 'true';
    setIsDebugMode(savedDebugMode);
  }, []);

  // デバッグモードの切り替え
  const toggleDebugMode = () => {
    const newDebugMode = !isDebugMode;
    setIsDebugMode(newDebugMode);
    localStorage.setItem('debugMode', newDebugMode.toString());
  };

  const startQuiz = (mode: QuestionType) => {
    // questionsDataがまだ読み込まれていない場合は、localStorageから取得
    const questions = questionsData ? questionsData[mode] : getQuestions(mode);
    const shuffledQuestions = shuffleArray(questions).slice(0, 10);
    
    setCurrentQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setCurrentQuizType(mode);
    setScreen('quiz');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setScreen('result');
    }
  };

  const answerQuestion = async (isCorrect: boolean, questionId: string) => {
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }

    // 成績をデータベースに保存
    try {
      await fetch('/api/quiz-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          isCorrect,
          quizType: currentQuizType,
        }),
      });
    } catch (error) {
      console.error('成績の保存に失敗しました:', error);
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

  const showStatistics = () => {
    setScreen('statistics');
  };

  const backToStart = () => {
    setScreen('start');
  };

  return (
    <div className="relative">
      {/* バージョン表記 */}
      <VersionLabel isDebugMode={isDebugMode} />
      
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 max-w-2xl w-full shadow-2xl animate-fade-in">
        {screen === 'start' && (
          <StartScreen 
            onStartQuiz={startQuiz} 
            onShowStatistics={showStatistics}
            questionsData={questionsData}
            isDebugMode={isDebugMode}
          />
        )}
        
        {screen === 'statistics' && (
          <StatisticsScreen 
            onBack={backToStart}
          />
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

      {/* 問題管理ボタン */}
      <button
        onClick={() => setShowQuestionManager(true)}
        className="fixed bottom-5 right-5 w-15 h-15 bg-orange-500 text-white rounded-full text-2xl font-bold hover:bg-orange-600 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        +
      </button>

      {/* デバッグモードボタン */}
      <div className="fixed bottom-5 left-5 flex flex-col gap-2">
        <button
          onClick={toggleDebugMode}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isDebugMode 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
          title={isDebugMode ? 'プロダクションモードに切替' : 'デバッグモードに切替'}
        >
          {isDebugMode ? '🐛 DEBUG' : '🚀 PROD'}
        </button>
        
        {isDebugMode && (
          <button
            onClick={() => setShowDebugPanel(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-all"
            title="デバッグパネルを開く"
          >
            🔧 Panel
          </button>
        )}
      </div>

      {showQuestionManager && (
        <QuestionManager onClose={() => setShowQuestionManager(false)} />
      )}

      {showDebugPanel && (
        <DebugPanel 
          isVisible={showDebugPanel} 
          onClose={() => setShowDebugPanel(false)} 
        />
      )}
    </div>
  );
}