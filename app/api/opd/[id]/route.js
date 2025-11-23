// pages/api/opd/[id].js

import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const opd = await prisma.oPD.findUnique({
      where: { id },
      include: {
        staff: true,
        reports: {
          include: {
            user: true, // pelapor
          },
        },
      },
    });

    if (!opd) {
      return new Response(JSON.stringify({ error: 'OPD tidak ditemukan' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(opd), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    '❌ Gagal ambil detail OPD:', error;
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}


export async function PATCH(req, { params }) {
  const { id } = params;
  
  try {
    // Parse the request body
    const body = await req.json();
    
    // Extract fields from request body
    const { name, alamat, email, telp, website } = body;
    
    // Basic validation
    if (!name || name.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Nama OPD tidak boleh kosong' }), 
        { status: 400 }
      );
    }
    
    // Email validation if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Format email tidak valid' }), 
        { status: 400 }
      );
    }
    
    // Update OPD in database
    const updatedOPD = await prisma.oPD.update({
      where: { id },
      data: {
        name,
        alamat,
        email,
        telp,
        website,
        updatedAt: new Date(),
      },
    });
    
    return new Response(JSON.stringify(updatedOPD), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('❌ Gagal memperbarui OPD:', error);
    
    // Handle specific errors
    if (error.code === 'P2025') {
      return new Response(
        JSON.stringify({ error: 'OPD tidak ditemukan' }), 
        { status: 404 }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}



export async function DELETE(req, { params }) {
  const { id } = params;
  
  try {
    // Check if OPD has associated reports
    const opdWithReports = await prisma.oPD.findUnique({
      where: { id },
      include: { reports: { select: { id: true }, take: 1 } }
    });
    
    if (!opdWithReports) {
      return new Response(
        JSON.stringify({ error: 'OPD tidak ditemukan' }), 
        { status: 404 }
      );
    }
    
    // Prevent deletion if OPD has reports
    if (opdWithReports.reports.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'OPD_HAS_REPORTS',
          message: 'OPD ini memiliki laporan terkait dan tidak dapat dihapus' 
        }), 
        { status: 400 }
      );
    }
    
    // Delete the OPD
    await prisma.oPD.delete({
      where: { id }
    });
    
    return new Response(null, { status: 204 });
    
  } catch (error) {
    console.error('❌ Gagal menghapus OPD:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}