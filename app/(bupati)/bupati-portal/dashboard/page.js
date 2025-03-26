'use client';

import React from 'react';
// import StatistikOverview from "@/components/bupati/statistic-overview";
import BupatiDashboard from '@/components/bupati/DashboardBupati';
import AdminDashboard from '@/components/admin/dashboard-admin';

export default function DashboardBupatiPage() {
  return <AdminDashboard  titleHeader={'Dashboard Bupati'}/>;
  // return <BupatiDashboard />;
}
