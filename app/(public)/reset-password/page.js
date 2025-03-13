import { Suspense } from "react";
import ResetPasswordForm from "@/components/reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
