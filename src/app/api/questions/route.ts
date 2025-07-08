import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { question, choices, correct, type } = body

    if (!question || !choices || correct === undefined || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const savedQuestion = await prisma.question.create({
      data: {
        question,
        choices: JSON.stringify(choices),
        correct,
        type
      }
    })

    return NextResponse.json(savedQuestion, { status: 201 })
  } catch (error) {
    console.error('Error saving question:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const questions = await prisma.question.findMany({
      where: type ? { type } : {},
      orderBy: { createdAt: 'desc' }
    })

    const formattedQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      choices: JSON.parse(q.choices),
      correct: q.correct,
      type: q.type
    }))

    return NextResponse.json(formattedQuestions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}