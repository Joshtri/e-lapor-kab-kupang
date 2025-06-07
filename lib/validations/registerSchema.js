import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z.string().nonempty({ message: 'Nama lengkap tidak boleh kosong.' }),
    nikNumber: z
      .string()
      .length(16, { message: 'NIK harus tepat 16 digit.' })
      .regex(/^\d+$/, { message: 'NIK hanya boleh berisi angka.' }),
    contactNumber: z
      .string()
      .min(10, { message: 'Nomor kontak minimal 10 digit.' })
      .regex(/^\d+$/, { message: 'Nomor kontak hanya boleh berisi angka.' }),
    email: z.string().email({ message: 'Gunakan email yang valid.' }),
    password: z
      .string()
      .min(6, { message: 'Password minimal 6 karakter.' })
      .regex(/[A-Z]/, { message: 'Harus mengandung huruf besar (A-Z).' })
      .regex(/[0-9]/, { message: 'Harus mengandung angka (0-9).' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Harus mengandung simbol/karakter khusus.',
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Konfirmasi password tidak cocok.',
      });
    }
  });
