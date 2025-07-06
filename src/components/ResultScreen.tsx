import { getGrade } from '@/utils/quizUtils';

interface ResultScreenProps {
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function ResultScreen({ correctCount, totalQuestions, onRestart }: ResultScreenProps) {
  const grade = getGrade(correctCount, totalQuestions);
  
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-8">テスト結果</h1>
      
      <div className="text-5xl font-bold text-indigo-600 mb-6">
        {correctCount} / {totalQuestions} 問正解
      </div>
      
      <div className={`text-8xl font-bold mb-6 ${grade.className} drop-shadow-lg`}>
        {grade.letter}
      </div>
      
      <div className="text-xl text-gray-700 mb-10 leading-relaxed whitespace-pre-line">
        {grade.comment}
      </div>
      
      <button
        onClick={onRestart}
        className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        もう一度挑戦
      </button>
    </div>
  );
}