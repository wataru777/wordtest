import { useState, useEffect } from 'react';
import { Question, QuestionType } from '@/types/quiz';
import { getAllQuestions, saveQuestions, getOriginalQuestions, parseCsv, fetchQuestionsFromDB } from '@/utils/quizUtils';

interface QuestionManagerProps {
  onClose: () => void;
}

export default function QuestionManager({ onClose }: QuestionManagerProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'csv' | 'manage'>('add');
  const [questionType, setQuestionType] = useState<QuestionType>('vocabulary');
  const [choiceCount, setChoiceCount] = useState(4);
  const [questions, setQuestions] = useState(getAllQuestions());
  const [editingIndex, setEditingIndex] = useState(-1);
  const [csvData, setCsvData] = useState<Question[]>([]);
  
  const [formData, setFormData] = useState({
    questionText: '',
    correctAnswer: '',
    wrongAnswer1: '',
    wrongAnswer2: '',
    wrongAnswer3: ''
  });

  useEffect(() => {
    const loadQuestions = async () => {
      const questionsFromDB = await fetchQuestionsFromDB();
      setQuestions(questionsFromDB);
    };
    
    loadQuestions();
  }, []);

  // データベースから問題を再読み込みする関数
  const reloadQuestions = async () => {
    const questionsFromDB = await fetchQuestionsFromDB();
    setQuestions(questionsFromDB);
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      correctAnswer: '',
      wrongAnswer1: '',
      wrongAnswer2: '',
      wrongAnswer3: ''
    });
    setEditingIndex(-1);
    setChoiceCount(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const choices = [
      formData.correctAnswer,
      formData.wrongAnswer1,
      formData.wrongAnswer2
    ];
    
    if (choiceCount === 4) {
      choices.push(formData.wrongAnswer3);
    }
    
    const newQuestion = {
      question: formData.questionText,
      choices,
      correct: 0,
      type: questionType
    };
    
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });
      
      if (response.ok) {
        const updatedQuestions = { ...questions };
        
        if (editingIndex !== -1) {
          updatedQuestions[questionType][editingIndex] = newQuestion;
          alert('問題を更新しました！');
        } else {
          updatedQuestions[questionType].push(newQuestion);
          alert('問題を追加しました！');
        }
        
        setQuestions(updatedQuestions);
        saveQuestions(updatedQuestions);
        await reloadQuestions(); // データベースから最新の問題を再読み込み
        resetForm();
      } else {
        alert('問題の保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('問題の保存中にエラーが発生しました');
    }
  };

  const handleEdit = (index: number) => {
    // 初期問題の編集に警告を表示
    if (isOriginalQuestion(index)) {
      if (!confirm('初期問題を編集すると、元の問題が変更されます。続行しますか？')) {
        return;
      }
    }

    const question = questions[questionType][index];
    setFormData({
      questionText: question.question,
      correctAnswer: question.choices[0],
      wrongAnswer1: question.choices[1],
      wrongAnswer2: question.choices[2],
      wrongAnswer3: question.choices[3] || ''
    });
    setChoiceCount(question.choices.length);
    setEditingIndex(index);
    setActiveTab('add');
  };

  const handleDelete = async (index: number) => {
    // 初期問題は削除できない
    if (isOriginalQuestion(index)) {
      alert('初期問題は削除できません。');
      return;
    }

    if (confirm('この問題を削除してもよろしいですか？')) {
      const updatedQuestions = { ...questions };
      updatedQuestions[questionType].splice(index, 1);
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
      await reloadQuestions(); // データベースから最新の問題を再読み込み
    }
  };

  const isOriginalQuestion = (index: number): boolean => {
    const originalQuestions = getOriginalQuestions();
    return index < originalQuestions[questionType].length &&
           JSON.stringify(questions[questionType][index]) === JSON.stringify(originalQuestions[questionType][index]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const parsedQuestions = parseCsv(csvText);
          setCsvData(parsedQuestions);
        } catch (error) {
          alert('CSVファイルの読み込みに失敗しました: ' + (error as Error).message);
          setCsvData([]);
        }
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const handleImportCsv = async () => {
    if (csvData.length === 0) {
      alert('インポートする問題がありません');
      return;
    }

    const updatedQuestions = { ...questions };
    const existingQuestions = updatedQuestions[questionType];
    
    // 重複チェック: 問題文が同じものを除外
    const newQuestions = csvData.filter(csvQuestion => {
      return !existingQuestions.some(existing => 
        existing.question.trim() === csvQuestion.question.trim()
      );
    });
    
    const duplicateCount = csvData.length - newQuestions.length;
    
    if (newQuestions.length === 0) {
      alert('すべての問題が既に存在しています。新しい問題は追加されませんでした。');
      return;
    }
    
    // データベースに新しい問題を保存
    try {
      const savePromises = newQuestions.map(question => 
        fetch('/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: question.question,
            choices: question.choices,
            correct: question.correct,
            type: questionType
          }),
        })
      );
      
      const responses = await Promise.all(savePromises);
      const failedSaves = responses.filter(response => !response.ok);
      
      if (failedSaves.length > 0) {
        alert(`${failedSaves.length}件の問題の保存に失敗しました`);
        return;
      }
      
      // 新しい問題のみを追加
      updatedQuestions[questionType] = [...existingQuestions, ...newQuestions];
      
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
      await reloadQuestions(); // データベースから最新の問題を再読み込み
      
      let message = `${newQuestions.length}件の問題を追加しました！`;
      if (duplicateCount > 0) {
        message += `\n（${duplicateCount}件の重複する問題はスキップされました）`;
      }
      alert(message);
      
      // フォームをリセット
      setCsvData([]);
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('CSVインポート中にエラーが発生しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">問題管理</h2>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'add' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            問題を追加
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'csv' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            CSV登録
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'manage' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            問題を管理
          </button>
        </div>
        
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">問題の種類</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              >
                <option value="vocabulary">語句</option>
                <option value="proverb">ことわざ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">選択肢の数</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setChoiceCount(3)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    choiceCount === 3 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-600'
                  }`}
                >
                  3択
                </button>
                <button
                  type="button"
                  onClick={() => setChoiceCount(4)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    choiceCount === 4 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-600'
                  }`}
                >
                  4択
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">問題文</label>
              <textarea
                value={formData.questionText}
                onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none min-h-[80px]"
                required
              />
              <small className="text-gray-500 text-sm block mt-1">
                ヒント: アンダーバーを引きたい部分を [[ ]] で囲んでください<br />
                例: 友人の失敗を見て、彼は[[あざ笑った]]
              </small>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">正解</label>
              <input
                type="text"
                value={formData.correctAnswer}
                onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">不正解の選択肢1</label>
              <input
                type="text"
                value={formData.wrongAnswer1}
                onChange={(e) => setFormData({...formData, wrongAnswer1: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">不正解の選択肢2</label>
              <input
                type="text"
                value={formData.wrongAnswer2}
                onChange={(e) => setFormData({...formData, wrongAnswer2: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                required
              />
            </div>
            
            {choiceCount === 4 && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">不正解の選択肢3</label>
                <input
                  type="text"
                  value={formData.wrongAnswer3}
                  onChange={(e) => setFormData({...formData, wrongAnswer3: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>
            )}
            
            <div className="flex gap-2 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                保存
              </button>
            </div>
          </form>
        )}
        
        {activeTab === 'csv' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">問題の種類</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              >
                <option value="vocabulary">語句</option>
                <option value="proverb">ことわざ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">CSVファイル</label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
              <small className="text-gray-500 text-sm block mt-2">
                CSVファイルの形式: 問題文,正解,不正解1,不正解2,不正解3(オプション)<br />
                例: この[[単語]]の意味は？,正しい意味,間違い1,間違い2,間違い3<br />
                ※問題文で[[]]を使うとアンダーバーが表示されます
              </small>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">プレビュー</label>
              <div className="max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                {csvData.length === 0 ? (
                  <p className="text-gray-500">CSVファイルを選択してください</p>
                ) : (
                  <div>
                    <p className="font-medium mb-4">{csvData.length}件の問題が見つかりました:</p>
                    <div className="space-y-3">
                      {csvData.map((question, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="font-medium text-sm text-gray-600 mb-1">問題 {index + 1}:</div>
                          <div className="mb-2">
                            <span 
                              dangerouslySetInnerHTML={{
                                __html: question.question.replace(/\[\[(.*?)\]\]/g, '<span style="text-decoration: underline;">$1</span>')
                              }}
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>正解:</strong> {question.choices[0]}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>不正解:</strong> {question.choices.slice(1).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                disabled={csvData.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                インポート
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'manage' && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">問題の種類</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              >
                <option value="vocabulary">語句</option>
                <option value="proverb">ことわざ</option>
              </select>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {questions[questionType].map((question, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-all">
                  <div className="flex-1">
                    <div className="font-medium">
                      {question.question.replace(/\[\[(.*?)\]\]/g, '$1')}
                      {isOriginalQuestion(index) && (
                        <span className="text-gray-500 text-sm ml-2">(初期問題)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        isOriginalQuestion(index)
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                      title={isOriginalQuestion(index) ? '初期問題（編集時に確認が必要）' : '問題を編集'}
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      disabled={isOriginalQuestion(index)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        isOriginalQuestion(index)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                      title={isOriginalQuestion(index) ? '初期問題は削除できません' : '問題を削除'}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}