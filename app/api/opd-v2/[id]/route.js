import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const opd = await prisma.oPD.findUnique({
      where: { id },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
            role: true,
          },
        },
        reports: {
          select: {
            id: true,
            title: true,
            bupatiStatus: true,
            opdStatus: true,
          },
        },
      },
    });

    if (!opd) {
      return NextResponse.json({ error: 'OPD not found' }, { status: 404 });
    }

    return NextResponse.json(opd, { status: 200 });
  } catch (error) {
    console.error('Error fetching OPD detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OPD detail' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only ADMIN can update OPD
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

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

    const opd = await prisma.oPD.findUnique({
      where: { id },
    });

    if (!opd) {
      return NextResponse.json({ error: 'OPD not found' }, { status: 404 });
    }

    const updatedOpd = await prisma.oPD.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.trim(),
        telp: telp.trim(),
        alamat: alamat.trim(),
        ...(website && website.trim() && { website: website.trim() }),
      },
    });

    return NextResponse.json(updatedOpd, { status: 200 });
  } catch (error) {
    console.error('Error updating OPD:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update OPD' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only ADMIN can delete OPD
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const opd = await prisma.oPD.findUnique({
      where: { id },
      include: {
        reports: { select: { id: true } },
      },
    });

    if (!opd) {
      return NextResponse.json({ error: 'OPD not found' }, { status: 404 });
    }

    // Check if OPD has reports
    if (opd.reports.length > 0) {
      return NextResponse.json(
        { error: 'OPD has related reports and cannot be deleted' },
        { status: 400 }
      );
    }

    // Delete the OPD (staff will be handled by cascade if configured, otherwise manually unlink)
    await prisma.oPD.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'OPD deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting OPD:', error);
    return NextResponse.json(
      { error: 'Failed to delete OPD' },
      { status: 500 }
    );
  }
}
