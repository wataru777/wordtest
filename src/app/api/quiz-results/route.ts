import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { questionId, isCorrect, quizType } = await request.json()

    if (!questionId || typeof isCorrect !== 'boolean' || !quizType) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      )
    }

    const result = await prisma.quizResult.create({
      data: {
        questionId,
        isCorrect,
        quizType
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Quiz result creation error:', error)
    return NextResponse.json(
      { error: '成績の保存に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizType = searchParams.get('type')

    const where = quizType ? { quizType } : {}

    const results = await prisma.quizResult.findMany({
      where,
      include: {
        question: true
      },
      orderBy: {
        answeredAt: 'desc'
      }
    })

    // 問題ごとの統計を計算
    const questionStats = new Map()

    for (const result of results) {
      const questionId = result.questionId
      if (!questionStats.has(questionId)) {
        questionStats.set(questionId, {
          question: result.question,
          totalAnswers: 0,
          correctAnswers: 0,
          recentResults: []
        })
      }

      const stats = questionStats.get(questionId)
      stats.totalAnswers++
      if (result.isCorrect) {
        stats.correctAnswers++
      }
      
      // 直近3回の結果を追加
      if (stats.recentResults.length < 3) {
        stats.recentResults.push(result.isCorrect)
      }
    }

    // 正答率を計算して配列に変換
    const questionStatsArray = Array.from(questionStats.values()).map(stats => ({
      question: stats.question,
      totalAnswers: stats.totalAnswers,
      correctAnswers: stats.correctAnswers,
      correctRate: stats.totalAnswers > 0 ? (stats.correctAnswers / stats.totalAnswers) * 100 : 0,
      recentCorrectRate: stats.recentResults.length > 0 
        ? (stats.recentResults.filter(Boolean).length / stats.recentResults.length) * 100 
        : 0
    }))

    // 正答率の悪い順でソート
    questionStatsArray.sort((a, b) => a.correctRate - b.correctRate)

    return NextResponse.json(questionStatsArray)
  } catch (error) {
    console.error('Quiz results fetch error:', error)
    return NextResponse.json(
      { error: '成績の取得に失敗しました' },
      { status: 500 }
    )
  }
}