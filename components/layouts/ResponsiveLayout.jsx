'use client';

import { useIsMobile } from '@/hooks/useMediaQuery';
import HeaderPelaporDesktop from '@/components/partials/pelapor/HeaderPelaporDesktop';
import FooterPelaporDesktop from '@/components/partials/pelapor/FooterPelaporDesktop';
import HeaderPelaporMobile from '@/components/partials/pelapor/HeaderPelaporMobile';
import FooterPelaporMobile from '@/components/partials/pelapor/FooterPelaporMobile';
import PropTypes from 'prop-types';

export default function ResponsiveLayout({ children }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-gray-900">
      {isMobile ? <HeaderPelaporMobile /> : <HeaderPelaporDesktop />}
      <main className={`flex-grow ${isMobile ? 'pt-14 pb-16' : 'pt-16'}`}>
        {children}
      </main>
      {isMobile ? <FooterPelaporMobile /> : <FooterPelaporDesktop />}
    </div>
  );
}

ResponsiveLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
