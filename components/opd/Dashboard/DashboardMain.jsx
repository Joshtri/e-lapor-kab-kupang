'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import OPDOnboardingDialog from '@/components/opd/Onboard/OnboardingDialog';
import OpdIkhtisarTab from '@/components/opd/Dashboard/OpdIkhtisarTab';
import OpdStatistikTab from '@/components/opd/Dashboard/OpdStatistikTab';
import TabsComponent from '@/components/ui/tabs-group';

const DashboardMain = () => {
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Pastikan komponen hanya render setelah di-mount di klien
  useEffect(() => {
    setMounted(true);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/reports/stats/opd-summary');
      setData(res.data);
    } catch (error) {
      console.error('Gagal fetch data dashboard OPD', error);
      toast.error('Gagal memuat data dashboard.');
    }
  };

  // Jangan render apapun sebelum komponen di-mount
  if (!mounted) return null;
  if (!data) return null;

  const tabs = [
    {
      title: 'Ikhtisar',
      content: <OpdIkhtisarTab data={data} />,
    },
    {
      title: 'Statistik',
      content: <OpdStatistikTab />,
    },
  ];

  return (
    <>
      <OPDOnboardingDialog />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard OPD
        </h1>
        <TabsComponent tabs={tabs} />
      </div>
    </>
  );
};

export default DashboardMain;
