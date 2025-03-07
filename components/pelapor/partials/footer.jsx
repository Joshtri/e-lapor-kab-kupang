"use client";

import React from "react";
import { Footer } from "flowbite-react";

const FooterPelapor = () => {
  return (
    <Footer container className="bg-green-600 text-white py-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <span className="text-sm text-gray-200">
          &copy; {new Date().getFullYear()} Lapor KK Bupati. All Rights
          Reserved.
        </span>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/tentang" className="text-gray-200 hover:underline">
            Tentang
          </a>
          <a href="/privasi" className="text-gray-200 hover:underline">
            Kebijakan Privasi
          </a>
          <a href="/kontak" className="text-gray-200 hover:underline">
            Kontak
          </a>
        </div>
      </div>
    </Footer>
  );
};

export default FooterPelapor;
