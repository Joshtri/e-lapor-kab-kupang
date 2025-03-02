"use client";

import React from "react";
import Link from "next/link";

const AdminFooter = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 py-6 mt-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Copyright */}
        <span className="text-sm text-gray-600 dark:text-gray-300">
          &copy; {new Date().getFullYear()} <span className="font-semibold">Lapor KK Bupati Admin</span>. All Rights Reserved.
        </span>

        {/* Link Navigasi */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/tentang" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:underline">
            Tentang
          </Link>
          <Link href="/privasi" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:underline">
            Kebijakan Privasi
          </Link>
          <Link href="/kontak" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:underline">
            Kontak
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
