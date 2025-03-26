'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import BugDetail from '@/components/admin/bugs/BugDetail';

export default function BugDetailPage() {
  const params = useParams();
  const bugId = params.id;

  // In a real app, you would fetch the current user from your auth system
  // This is just a placeholder
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <BugDetail bugId={bugId} currentUser={currentUser} />
    </main>
  );
}
