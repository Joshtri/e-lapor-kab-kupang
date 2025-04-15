import { decrypt } from '@/lib/encryption';

export function getMaskedNik(nikEncrypted) {
  try {
    const decrypted = decrypt(nikEncrypted);
    return `**** **** ${decrypted.slice(-4)}`;
  } catch {
    return '**** **** ****'; // fallback jika gagal decrypt
  }
}
