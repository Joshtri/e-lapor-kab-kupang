import { decrypt } from '@/lib/encryption';

export function getDecryptedNik(nikEncrypted) {
  if (!nikEncrypted || typeof nikEncrypted !== 'string') return null;

  if (nikEncrypted.includes('*')) {
    return nikEncrypted; // masking, jangan decrypt
  }

  try {
    const decrypted = decrypt(nikEncrypted);
    return decrypted || null;
  } catch (err) {
    // console.warn('❌ Decrypt failed:', err);
    return null;
  }
}
