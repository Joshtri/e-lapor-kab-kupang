import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('token'); // Ganti sesuai nama token login Pelapor
  if (!token) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: { role: 'PELAPOR' } });
}
