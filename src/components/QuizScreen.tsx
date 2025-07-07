import { useState, useEffect } from 'react';
import { Question } from '@/types/quiz';
import { shuffleArray } from '@/utils/quizUtils';

interface QuizScreenProps {
  question: Question;
  questionNumber: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onQuit: () => void;
}

export default function QuizScreen({ question, questionNumber, onAnswer, onNext, onQuit }: QuizScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState(() => {
    const indices = shuffleArray([0, 1, 2, 3].slice(0, question.choices.length));
    return indices.map(originalIndex => ({
      text: question.choices[originalIndex],
      originalIndex,
      isCorrect: originalIndex === question.correct
    }));
  });

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFeedback(false);
    
    const indices = shuffleArray([0, 1, 2, 3].slice(0, question.choices.length));
    setShuffledChoices(indices.map(originalIndex => ({
      text: question.choices[originalIndex],
      originalIndex,
      isCorrect: originalIndex === question.correct
    })));
  }, [question]);

  const handleChoiceClick = (choiceIndex: number, originalIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(choiceIndex);
    const isCorrect = originalIndex === question.correct;
    onAnswer(isCorrect);
    
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setShowResult(true);
    }, 800);
  };

  const handleNext = () => {
    onNext();
  };

  const formatQuestionText = (text: string) => {
    return text.replace(/\[\[(.*?)\]\]/g, '<span class="underline decoration-2 decoration-indigo-600 underline-offset-4 font-bold">$1</span>');
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div className="text-center text-gray-600 text-lg flex-1">
          問題 {questionNumber} / 10
        </div>
        <button 
          onClick={onQuit}
          className="w-8 h-8 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-all duration-200 hover:scale-110 flex items-center justify-center"
          title="テストを終了"
        >
          ✕
        </button>
      </div>
      
      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
        <div 
          className="text-xl text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatQuestionText(question.question) }}
        />
      </div>
      
      <div className="grid gap-4">
        {shuffledChoices.map((choice, index) => {
          let buttonClass = "w-full p-5 bg-white border-2 border-gray-300 rounded-xl text-left text-lg cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:border-indigo-600 hover:translate-x-1";
          
          if (selectedAnswer === index) {
            if (choice.isCorrect) {
              buttonClass += " bg-green-100 border-green-500 animate-pulse";
            } else {
              buttonClass += " bg-red-100 border-red-500 animate-shake";
            }
          } else if (showResult && choice.isCorrect) {
            buttonClass += " bg-green-100 border-green-500";
          }
          
          if (selectedAnswer !== null) {
            buttonClass += " pointer-events-none";
          }
          
          return (
            <button
              key={index}
              onClick={() => handleChoiceClick(index, choice.originalIndex)}
              className={buttonClass}
              disabled={selectedAnswer !== null}
            >
              {index + 1}. {choice.text}
            </button>
          );
        })}
      </div>
      
      {showResult && (
        <div className="text-center mt-8">
          <button
            onClick={handleNext}
            className="bg-white text-gray-700 border-2 border-indigo-600 px-10 py-4 rounded-xl text-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105"
          >
            次の問題へ
          </button>
        </div>
      )}
      
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className={`text-9xl font-bold animate-ping ${selectedAnswer !== null && shuffledChoices[selectedAnswer].isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {selectedAnswer !== null && shuffledChoices[selectedAnswer].isCorrect ? '○' : '×'}
          </div>
        </div>
      )}
    </div>
  );
}