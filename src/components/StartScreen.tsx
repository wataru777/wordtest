import { QuestionType, QuizData } from '@/types/quiz';

interface StartScreenProps {
  onStartQuiz: (mode: QuestionType) => void;
  questionsData?: QuizData | null;
  isDebugMode?: boolean;
}

export default function StartScreen({ onStartQuiz, questionsData, isDebugMode }: StartScreenProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-8">語句・ことわざ・和語テスト</h1>
      <p className="text-lg text-gray-600 mb-8">どのテストを受けますか？</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onStartQuiz('vocabulary')}
          className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <div>
            語句<br />テスト
          </div>
          {isDebugMode && questionsData && (
            <div className="text-sm font-normal mt-1 opacity-75">
              {questionsData.vocabulary.length}問
            </div>
          )}
        </button>
        <button
          onClick={() => onStartQuiz('proverb')}
          className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <div>
            ことわざ<br />テスト
          </div>
          {isDebugMode && questionsData && (
            <div className="text-sm font-normal mt-1 opacity-75">
              {questionsData.proverb.length}問
            </div>
          )}
        </button>
        <button
          onClick={() => onStartQuiz('wago')}
          className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <div>
            和語<br />テスト
          </div>
          {isDebugMode && questionsData && (
            <div className="text-sm font-normal mt-1 opacity-75">
              {questionsData.wago.length}問
            </div>
          )}
        </button>
      </div>

      {/* デバッグ情報 */}
      {isDebugMode && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-800 mb-2">🐛 デバッグ情報</h3>
          <div className="space-y-1 text-gray-600">
            <p>モード: {process.env.NODE_ENV || 'development'}</p>
            <p>データ読み込み: {questionsData ? '✅' : '❌'}</p>
            {questionsData && (
              <>
                <p>総語句問題: {questionsData.vocabulary.length}問</p>
                <p>総ことわざ問題: {questionsData.proverb.length}問</p>
                <p>総和語問題: {questionsData.wago.length}問</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}