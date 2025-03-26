import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Ambil token dari request dan validasi
export function verifyToken(req) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // biasanya { id, role, ... }
  } catch (error) {
    return null;
  }
}

// ✅ Untuk membuat token saat login
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}
