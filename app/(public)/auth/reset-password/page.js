import { Suspense } from 'react';
import ResetPasswordForm from '@/components/reset-password';

export const metadata = {
  title: 'Reset Password | Lapor KK Bupati',
  description: 'Masukkan password baru untuk mengamankan akun Anda.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
