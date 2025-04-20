import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(req) {
  const token = req.cookies.get('auth_token')?.value;
  const url = req.nextUrl.clone();

  if (token && PUBLIC_AUTH_PATHS.includes(url.pathname)) {
    try {
      const decoded = verify(token, JWT_SECRET); // optional cek valid token
      // ⬅️ Optional: redirect sesuai role
      // if (decoded.role === 'ADMIN') url.pathname = '/admin';
      // else if (decoded.role === 'PELAPOR') url.pathname = '/pelapor/dashboard';
      // else url.pathname = '/';
      url.pathname = '/'; // default redirect
      return NextResponse.redirect(url);
    } catch {
      // token tidak valid, biarkan akses halaman login
    }
  }

  return NextResponse.next();
}
