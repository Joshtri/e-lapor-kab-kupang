'use client';

import ReportModal from '@/components/pelapor/CreateReportModal';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import QuickActionsMobile from './QuickActionsButton';
import RecentReportsMobile from './RecentReportsMobile';
import StatisticsMobile from './StatisticsMobile';
// import QuickActionsMobile from './mobile/QuickActionsButton';
// import RecentReportsMobile from './mobile/RecentReportsMobile';
// import StatisticsMobile from './mobile/StatisticsMobile';

const DashboardPelaporMobile = ({ user }) => {
  const searchParams = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [refetchStats, setRefetchStats] = useState(0);

  useEffect(() => {
    const shouldOpenModal = searchParams.get('openModal') === 'true';
    if (shouldOpenModal) {
      setOpenModal(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('openModal');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);

  const handleRefetch = () => {
    setRefetchStats((prev) => prev + 1);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      'Halo KK Yos & Sis Arumi,\n\nNIK: \nNAMA: \nAlamat: \n\nSaya ingin melaporkan\n\nDeskripsi Laporan: \n\nTerima kasih. UIS NENO NOKAN KIT.',
    );
    window.open(`https://wa.me/6281237159777?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Mobile Content */}
      <div className="p-4">
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Statistics */}
            <StatisticsMobile user={user} triggerRefetch={refetchStats} />

            {/* Quick Actions */}
            <QuickActionsMobile
              setOpenModal={setOpenModal}
              handleWhatsApp={handleWhatsApp}
            />

            {/* Recent Reports */}
            <RecentReportsMobile
              user={user}
              triggerRefetch={refetchStats}
              onViewAll={() => setActiveTab('reports')}
            />
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Statistik
            </h2>
            <StatisticsMobile user={user} triggerRefetch={refetchStats} />
          </motion.div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        user={user}
        onSuccess={handleRefetch}
      />
    </div>
  );
};
DashboardPelaporMobile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default DashboardPelaporMobile;
