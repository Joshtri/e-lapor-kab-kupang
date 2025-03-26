// File: app/api/bugs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const bugs = await prisma.bugReport.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(bugs)
  } catch (error) {
    console.error('[BUGS_GET]', error)
    return NextResponse.json({ error: 'Gagal mengambil data bug' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, title, description, priorityProblem } = body

    if (!userId || !title || !description) {
      return NextResponse.json({ error: 'Field tidak lengkap' }, { status: 400 })
    }

    const newBug = await prisma.bugReport.create({
      data: {
        userId,
        title,
        description,
        priorityProblem,
      },
    })

    return NextResponse.json(newBug, { status: 201 })
  } catch (error) {
    console.error('[BUGS_POST]', error)
    return NextResponse.json({ error: 'Gagal membuat bug report' }, { status: 500 })
  }
}
