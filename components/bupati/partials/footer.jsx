"use client";

import React from "react";
import Link from "next/link";

const FooterBupati = () => {
  return (
    <footer className="bg-blue-600 text-white py-6 mt-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <span className="text-sm text-gray-200">
          &copy; {new Date().getFullYear()} Lapor KK Bupati. Hak Cipta
          Dilindungi.
        </span>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/tentang" className="text-gray-200 hover:underline">
            Tentang
          </Link>
          <Link href="/privasi" className="text-gray-200 hover:underline">
            Kebijakan Privasi
          </Link>
          <Link href="/kontak" className="text-gray-200 hover:underline">
            Kontak
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterBupati;
