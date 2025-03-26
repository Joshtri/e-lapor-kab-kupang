import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Ambil total semua laporan
    const totalReports = await prisma.report.count()

    // Ambil jumlah laporan selesai dan dalam proses
    const resolvedReports = await prisma.report.count({
      where: { opdStatus: 'SELESAI' },
    })

    const inProgressReports = await prisma.report.count({
      where: { opdStatus: 'PROSES' },
    })

    // Hitung kepuasan sebagai % laporan yang selesai
    const satisfaction =
      totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0

    return NextResponse.json({
      reports: totalReports,
      resolved: resolvedReports,
      inProgress: inProgressReports,
      satisfaction,
    })
  } catch (error) {
    console.error('Error fetching public stats:', error)
    return NextResponse.json(
      { message: 'Gagal mengambil statistik.', error: error.message },
      { status: 500 }
    )
  }
}
