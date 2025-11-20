import { Suspense } from 'react';
import ResetPasswordForm from '@/features/auth/ResetPassword';

export const metadata = {
  title: 'Reset Password | Lapor Kaka Bupati',
  description: 'Masukkan password baru untuk mengamankan akun Anda.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
