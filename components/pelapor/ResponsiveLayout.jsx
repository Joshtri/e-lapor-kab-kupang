'use client';

import { useIsMobile } from '@/hooks/use-media-query';
import HeaderPelaporDesktop from '@/components/pelapor/partials/HeaderPelaporDesktop';
import FooterPelaporDesktop from '@/components/pelapor/partials/FooterPelaporDesktop';
import HeaderPelaporMobile from '@/components/pelapor/partials/HeaderPelaporMobile';
import FooterPelaporMobile from '@/components/pelapor/partials/FooterPelaporMobile';
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
