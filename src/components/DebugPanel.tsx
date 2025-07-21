"use client";

import { useState, useEffect } from 'react';
import { getAllQuestions, fetchQuestionsFromDB, getOriginalQuestions } from '@/utils/quizUtils';
import { QuizData } from '@/types/quiz';

interface DebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DebugPanel({ isVisible, onClose }: DebugPanelProps) {
  const [localStorageData, setLocalStorageData] = useState<QuizData | null>(null);
  const [databaseData, setDatabaseData] = useState<QuizData | null>(null);
  const [originalData] = useState<QuizData>(getOriginalQuestions());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadDebugData();
    }
  }, [isVisible]);

  const loadDebugData = async () => {
    setLoading(true);
    try {
      // LocalStorage データ
      setLocalStorageData(getAllQuestions());
      
      // データベース データ
      const dbData = await fetchQuestionsFromDB();
      setDatabaseData(dbData);
    } catch (error) {
      console.error('Error loading debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLocalStorage = () => {
    if (confirm('LocalStorageの問題データを削除してもよろしいですか？')) {
      localStorage.removeItem('allQuestions');
      loadDebugData();
      alert('LocalStorageをクリアしました');
    }
  };

  const syncFromDatabase = async () => {
    if (confirm('データベースからデータを再同期してもよろしいですか？')) {
      setLoading(true);
      try {
        const dbData = await fetchQuestionsFromDB();
        setDatabaseData(dbData);
        setLocalStorageData(getAllQuestions());
        alert('データベースから再同期しました');
      } catch {
        alert('同期中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🐛 デバッグパネル</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">データを読み込み中...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Original Questions */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-600 mb-3">📦 元の問題</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">語句:</span> {originalData.vocabulary.length}問</p>
              <p><span className="font-medium">ことわざ:</span> {originalData.proverb.length}問</p>
              <p className="text-gray-600">アプリに内蔵されている問題</p>
            </div>
          </div>

          {/* LocalStorage Data */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">💾 LocalStorage</h3>
            <div className="space-y-2 text-sm">
              {localStorageData ? (
                <>
                  <p><span className="font-medium">語句:</span> {localStorageData.vocabulary.length}問</p>
                  <p><span className="font-medium">ことわざ:</span> {localStorageData.proverb.length}問</p>
                </>
              ) : (
                <p className="text-gray-500">データなし</p>
              )}
              <button
                onClick={clearLocalStorage}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                クリア
              </button>
            </div>
          </div>

          {/* Database Data */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-600 mb-3">🗄️ データベース</h3>
            <div className="space-y-2 text-sm">
              {databaseData ? (
                <>
                  <p><span className="font-medium">語句:</span> {databaseData.vocabulary.length}問</p>
                  <p><span className="font-medium">ことわざ:</span> {databaseData.proverb.length}問</p>
                  <p className="text-xs text-gray-600">元の問題 + カスタム問題</p>
                </>
              ) : (
                <p className="text-gray-500">データなし</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={syncFromDatabase}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            DBから再同期
          </button>
          <button
            onClick={loadDebugData}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
          >
            データ更新
          </button>
        </div>

        {/* Environment Info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">🔧 環境情報</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Node ENV:</span> {process.env.NODE_ENV || 'development'}</p>
            <p><span className="font-medium">App URL:</span> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
            <p><span className="font-medium">LocalStorage Available:</span> {typeof window !== 'undefined' && localStorage ? '✅' : '❌'}</p>
            <p><span className="font-medium">Database Connection:</span> {databaseData ? '✅' : '❌'}</p>
          </div>
        </div>

        {/* Console Logs */}
        <div className="mt-6 p-4 bg-gray-900 text-gray-300 rounded-lg">
          <h4 className="font-semibold text-white mb-2">📊 統計情報</h4>
          <div className="text-xs font-mono space-y-1">
            <p>元の語句問題: {originalData.vocabulary.length}問</p>
            <p>元のことわざ問題: {originalData.proverb.length}問</p>
            {localStorageData && (
              <>
                <p>LocalStorage語句: {localStorageData.vocabulary.length}問</p>
                <p>LocalStorageことわざ: {localStorageData.proverb.length}問</p>
              </>
            )}
            {databaseData && (
              <>
                <p>DB統合語句: {databaseData.vocabulary.length}問</p>
                <p>DB統合ことわざ: {databaseData.proverb.length}問</p>
                <p>カスタム語句: {Math.max(0, databaseData.vocabulary.length - originalData.vocabulary.length)}問</p>
                <p>カスタムことわざ: {Math.max(0, databaseData.proverb.length - originalData.proverb.length)}問</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}