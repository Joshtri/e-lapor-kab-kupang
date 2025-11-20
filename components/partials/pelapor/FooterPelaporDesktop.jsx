'use client';

import { Footer } from 'flowbite-react';

const FooterPelaporDesktop = () => {
  return (
    <Footer container className="bg-green-600 text-white py-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <span className="text-sm text-gray-200">
          &copy; {new Date().getFullYear()} Lapor Kaka Bupati. All Rights
          Reserved.
        </span>
      </div>
    </Footer>
  );
};

export default FooterPelaporDesktop;
