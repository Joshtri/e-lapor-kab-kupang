'use client';

import AddBugReport from '@/components/admin/bugs/BugCreate';

export default function AddBugReportPage() {
  // In a real app, you would fetch the current user from your auth system
  // This is just a placeholder
  const currentUser = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  };

  return <AddBugReport currentUser={currentUser} />;
}
