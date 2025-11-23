import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only ADMIN and BUPATI can view all OPDs
  if (user.role !== 'ADMIN' && user.role !== 'BUPATI') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const opds = await prisma.oPD.findMany({
      include: {
        reports: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            staff: true, // Count jumlah staff di OPD ini
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(opds, { status: 200 });
  } catch (error) {
    console.error('Error fetching OPDs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OPDs' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only ADMIN can create OPD
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { name, email, telp, alamat, website } = await req.json();

    // Validate required fields
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Nama OPD minimal 3 karakter dan wajib diisi' },
        { status: 400 }
      );
    }

    if (!email || email.trim().length === 0 || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email instansi wajib diisi dan harus valid' },
        { status: 400 }
      );
    }

    if (!telp || telp.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nomor telepon instansi wajib diisi' },
        { status: 400 }
      );
    }

    if (!alamat || alamat.trim().length === 0) {
      return NextResponse.json(
        { error: 'Alamat instansi wajib diisi' },
        { status: 400 }
      );
    }

    const newOpd = await prisma.oPD.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        telp: telp.trim(),
        alamat: alamat.trim(),
        ...(website && website.trim() && { website: website.trim() }),
      },
    });

    return NextResponse.json(newOpd, { status: 201 });
  } catch (error) {
    console.error('Error creating OPD:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create OPD' },
      { status: 500 }
    );
  }
}
