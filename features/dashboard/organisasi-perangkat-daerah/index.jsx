'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import OPDOnboardingDialog from '@/components/opd/Onboard/OnboardingDialog';
import OpdIkhtisarTab from '@/features/dashboard/organisasi-perangkat-daerah/OpdIkhtisarTab';
import OpdStatistikTab from '@/features/dashboard/organisasi-perangkat-daerah/OpdStatistikTab';
import TabsComponent from '@/components/ui/TabsGroup';
import DashboardNotificationPanelOpd from '@/components/DashboardNotificationPanelOpd';

const DashboardMain = () => {
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(true);
  const [userId, setUserId] = useState(null);
  const [opdProfile, setOpdProfile] = useState(null);

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
        setShowOnboarding(true);
        return;
      }

      // ✅ Ambil data dashboard
      const res = await axios.get('/api/reports/stats/opd-summary');
      setData(res.data);

      // ✅ Ambil data profil OPD
      const opdRes = await axios.get('/api/opd/staff-profile');
      setOpdProfile(opdRes.data);
    } catch (error) {
      // ('Gagal memuat dashboard atau profil:', error);
      toast.error('Gagal memuat data dashboard.');
    } finally {
      setLoadingOnboarding(false);
    }
  };

  // Jangan tampilkan apapun sampai semuanya jelas
  if (!mounted || (loadingOnboarding && !showOnboarding)) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-[250px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-5 w-[180px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-[200px] w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-[120px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <div className="h-[120px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <div className="h-[120px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 space-y-6"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                Dashboard OPD
                {opdProfile?.name && (
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-2xl">
                    {' '}
                    - {opdProfile.name}
                  </span>
                )}
              </h1>
              {opdProfile?.staff?.name && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  Selamat datang,{' '}
                  <span className="font-medium">{opdProfile.staff.name}</span>
                </p>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <DashboardNotificationPanelOpd />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <TabsComponent tabs={tabs} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DashboardMain;
