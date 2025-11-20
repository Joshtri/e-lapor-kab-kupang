'use client';

import { useCurrentUser } from '@/services/authService';
import AdminQuickActions from './AdminQuickActions';
import BuPatiQuickActions from './BuPatiQuickActions';
import OpdQuickActions from './OpdQuickActions';
import PelaporQuickActions from './PelaporQuickActions';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';

export default function QuickActionsGrid() {
  const { data: user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) {
    return <LoadingScreen isLoading={true} message="Memuat quick actions..." />;
  }

  if (isError || !user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 dark:text-red-400">
          {error?.message || 'Gagal memuat quick actions'}
        </p>
      </div>
    );
  }

  // Render quick actions berdasarkan role user
  switch (user.role) {
    case 'ADMIN':
      return <AdminQuickActions user={user} />;
    case 'BUPATI':
      return <BuPatiQuickActions user={user} />;
    case 'OPD':
      return <OpdQuickActions user={user} />;
    case 'PELAPOR':
      return <PelaporQuickActions user={user} />;
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Role tidak dikenali
          </p>
        </div>
      );
  }
}
