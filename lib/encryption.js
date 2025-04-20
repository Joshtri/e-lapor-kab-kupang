import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto'

const IV_LENGTH = 16
const ENCRYPTION_KEY = createHash('sha256').update(process.env.ENCRYPTION_SECRET).digest() // 32 bytes

export function encrypt(text) {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

/**
 * Mendekripsi teks terenkripsi (format: iv:encrypted)
 * @param {string} text - string terenkripsi
 * @returns {string} hasil dekripsi atau fallback
 */
export function decrypt(text) {
  try {
    if (!text || typeof text !== 'string') {
      // console.warn('Bypassed decrypt: invalid input (null or non-string)');
      return '';
    }

    if (!text.includes(':')) {
      // console.warn('Bypassed decrypt: not encrypted format:', text);
      return text;
    }

    const [ivHex, encrypted] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted || '';
  } catch (error) {
    // console.warn('❌ Gagal decrypt, fallback ke original:', text);
    return text;
  }
}