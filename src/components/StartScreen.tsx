import { QuestionType } from '@/types/quiz';

interface StartScreenProps {
  onStartQuiz: (mode: QuestionType) => void;
}

export default function StartScreen({ onStartQuiz }: StartScreenProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-8">語句・ことわざテスト</h1>
      <p className="text-lg text-gray-600 mb-8">どちらのテストを受けますか？</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onStartQuiz('vocabulary')}
          className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          語句テスト
        </button>
        <button
          onClick={() => onStartQuiz('proverb')}
          className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          ことわざテスト
        </button>
      </div>
    </div>
  );
}