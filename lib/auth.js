import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Fungsi utama: ambil user dari header atau cookie
export async function getAuthenticatedUser(req) {
  // 1. Cek Authorization header (Bearer token)
  const authHeader =
    req?.headers?.get('authorization') || req?.headers?.get('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }

  // 2. Cek dari cookie (auth_token)
  try {
    const cookieStore = cookies(); // tidak perlu await, ini synchronous di Next.js 14+
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Generator token biasa
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}
