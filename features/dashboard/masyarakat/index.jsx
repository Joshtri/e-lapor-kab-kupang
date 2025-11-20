'use client';

// import DashboardPelaporDesktop from '@/features/dashboard/masyarakat/desktop';
import { useIsMobile } from '@/hooks/useMediaQuery';
// import DashboardPelaporMobile from '@/components/pelapor/dashboard/DashboardPelaporMobile';
import PropTypes from 'prop-types';
import DashboardPelaporMobile from './mobile';
import DashboardPelaporDesktop from './desktop';

const DashboardPelaporGrid = ({ user }) => {
  const isMobile = useIsMobile();

  // Show mobile version for screens smaller than 768px
  if (isMobile) {
    return <DashboardPelaporMobile user={user} />;
  }

  // Show desktop version for larger screens
  return <DashboardPelaporDesktop user={user} />;
};

DashboardPelaporGrid.propTypes = {
  user: PropTypes.object.isRequired,
};

export default DashboardPelaporGrid;
