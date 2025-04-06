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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setMounted(true);
    checkProfileAndData();
  }, []);

  const checkProfileAndData = async () => {
    try {
      const me = await axios.get('/api/auth/me');
      const { id, role } = me.data.user || {};
      if (role !== 'OPD') return;

      setUserId(id);

      const check = await axios.get('/api/opd/check-profile');
      if (!check.data?.hasProfile) {
        setShowOnboarding(true); // ✅ tampilkan form onboarding
        return;
      }

      // ✅ Jika sudah ada profil OPD, lanjut fetch data dashboard
      const res = await axios.get('/api/reports/stats/opd-summary');
      setData(res.data);
    } catch (error) {
      console.error('Gagal memuat dashboard atau profil:', error);
      toast.error('Gagal memuat data dashboard.');
    } finally {
      setLoadingOnboarding(false);
    }
  };

  // Jangan tampilkan apapun sampai semuanya jelas
  if (!mounted || (loadingOnboarding && !showOnboarding)) return null;

  const tabs = [
    {
      title: 'Ikhtisar',
      content: <OpdIkhtisarTab data={data} onReload={checkProfileAndData} />,
    },
    {
      title: 'Statistik',
      content: <OpdStatistikTab />,
    },
  ];

  return (
    <>
      <OPDOnboardingDialog
        show={showOnboarding}
        setShow={setShowOnboarding}
        userId={userId}
        loading={loadingOnboarding}
      />
      {!showOnboarding && (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard OPD
          </h1>
          <TabsComponent tabs={tabs} />
        </div>
      )}
    </>
  );
};

export default DashboardMain;
