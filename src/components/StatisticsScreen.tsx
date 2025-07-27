'use client'

import { useState, useEffect } from 'react'

interface QuestionStat {
  question: {
    id: string
    question: string
    type: string
  }
  totalAnswers: number
  correctAnswers: number
  correctRate: number
  recentCorrectRate: number
}

interface StatisticsScreenProps {
  onBack: () => void
}

export default function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const [selectedType, setSelectedType] = useState<'vocabulary' | 'proverb' | 'wago'>('vocabulary')
  const [stats, setStats] = useState<QuestionStat[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)

  const loadStats = async (type: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/quiz-results?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('成績の取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats(selectedType)
  }, [selectedType])

  const sortedStats = [...stats].sort((a, b) => {
    return sortOrder === 'asc' 
      ? a.correctRate - b.correctRate 
      : b.correctRate - a.correctRate
  })

  const formatQuestion = (question: string) => {
    return question.replace(/\[\[([^\]]+)\]\]/g, '<u>$1</u>')
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vocabulary': return '語句'
      case 'proverb': return 'ことわざ'
      case 'wago': return '和語'
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">成績表</h1>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              戻る
            </button>
          </div>

          {/* タイプ選択ボタン */}
          <div className="flex gap-4 mb-6">
            {(['vocabulary', 'proverb', 'wago'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-indigo-600 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {getTypeLabel(type)}
              </button>
            ))}
          </div>

          {/* ソート順選択 */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSortOrder('asc')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                sortOrder === 'asc'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              正答率 昇順
            </button>
            <button
              onClick={() => setSortOrder('desc')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                sortOrder === 'desc'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              正答率 降順
            </button>
          </div>

          {/* 成績表 */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">読み込み中...</div>
            </div>
          ) : stats.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">
                {getTypeLabel(selectedType)}の成績データがありません
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">
                      問題文
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 border-b">
                      正答数
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 border-b">
                      出題数
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 border-b">
                      正答率
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 border-b">
                      直近3回の正答率
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStats.map((stat, index) => (
                    <tr
                      key={stat.question.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-indigo-50 transition-colors`}
                    >
                      <td className="px-6 py-4 border-b">
                        <div
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html: formatQuestion(stat.question.question)
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-center border-b text-gray-700">
                        {stat.correctAnswers}
                      </td>
                      <td className="px-6 py-4 text-center border-b text-gray-700">
                        {stat.totalAnswers}
                      </td>
                      <td className="px-6 py-4 text-center border-b">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            stat.correctRate >= 80
                              ? 'bg-green-100 text-green-800'
                              : stat.correctRate >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {stat.correctRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center border-b">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            stat.recentCorrectRate >= 80
                              ? 'bg-green-100 text-green-800'
                              : stat.recentCorrectRate >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {stat.recentCorrectRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}