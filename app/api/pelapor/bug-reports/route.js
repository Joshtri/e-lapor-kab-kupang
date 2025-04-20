import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);
    const { searchParams } = new URL(req.url);

    if (!user || user.role !== 'PELAPOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination and filter parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const priority = searchParams.get('priority');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Calculate date range if month/year filter is applied
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      dateFilter = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    // Build where clause
    const where = {
      userId: user.id,
      ...(priority && { priorityProblem: priority }),
      ...dateFilter,
    };

    // Get total count for pagination
    const totalItems = await prisma.bugReport.count({ where });

    // Get paginated results
    const bugReports = await prisma.bugReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        priorityProblem: true,
        statusProblem: true,
        createdAt: true,
        _count: {
          select: { bugComments: true },
        },
      },
    });

    // Check for attachments
    const attachments = await prisma.bugReport.findMany({
      where: {
        userId: user.id,
        NOT: { attachment: null },
      },
      select: { id: true },
    });

    const attachmentIds = new Set(attachments.map((a) => a.id));

    const data = bugReports.map((report) => ({
      ...report,
      hasAttachment: attachmentIds.has(report.id),
    }));

    return NextResponse.json({
      data,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      currentPage: page,
    });
  } catch (error) {
    '[BUG_REPORT_GET]', error;
    return NextResponse.json(
      { error: 'Gagal memuat bug report' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user || user.role !== 'PELAPOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const priorityProblem = formData.get('priorityProblem') || 'LOW';
    const file = formData.get('attachment');

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Judul dan deskripsi wajib diisi.' },
        { status: 400 },
      );
    }

    // Optional: Validasi file
    let imageBuffer = null;
    if (file && typeof file.arrayBuffer === 'function') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'File harus berupa gambar.' },
          { status: 400 },
        );
      }

      if (file.size > 5_000_000) {
        return NextResponse.json(
          { error: 'Ukuran gambar maksimal 5MB.' },
          { status: 400 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    const createdBug = await prisma.bugReport.create({
      data: {
        userId: user.id,
        title,
        description,
        priorityProblem,
        attachment: imageBuffer,
      },
    });

    return NextResponse.json(createdBug, { status: 201 });
  } catch (error) {
    '[BUG_REPORT_CREATE]', error;
    return NextResponse.json(
      { error: 'Gagal membuat laporan bug.' },
      { status: 500 },
    );
  }
}
