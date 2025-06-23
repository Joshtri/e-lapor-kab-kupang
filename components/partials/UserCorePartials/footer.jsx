'use client';

import React from 'react';
import Link from 'next/link';

// Configuration for each role
const ROLE_CONFIG = {
  admin: {
    bg: 'bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700',
    text: 'text-gray-600 dark:text-gray-300',
    hover: 'hover:text-green-600 dark:hover:text-green-400 hover:underline',
    brand: 'Lapor Kaka Bupati Admin',
    copyPhrase: 'All Rights Reserved.',
  },
  bupati: {
    bg: 'bg-blue-600',
    text: 'text-gray-200',
    hover: 'hover:underline',
    brand: 'Lapor Kaka Bupati',
    copyPhrase: 'Hak Cipta Dilindungi.',
  },
  opd: {
    bg: 'bg-purple-600',
    text: 'text-gray-200',
    hover: 'hover:underline',
    brand: 'Lapor KK OPD',
    copyPhrase: 'Hak Cipta Dilindungi.',
  },
};

/**
 * Reusable Footer component for Admin, OPD, or Bupati roles
 *
 * @param {{ role?: 'admin' | 'bupati' | 'opd' }} props
 */
export default function Footer({ role = 'admin' }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.admin;
  const year = new Date().getFullYear();

  //   const links = [
  //     { href: '/tentang', label: 'Tentang' },
  //     { href: '/privasi', label: 'Kebijakan Privasi' },
  //     { href: '/kontak', label: 'Kontak' },
  //   ];

  return (
    <footer className={`${cfg.bg} py-6 mt-auto`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Copyright */}
        <span className={`text-sm ${cfg.text}`}>
          &copy; {year} <span className="font-semibold">{cfg.brand}</span>.{' '}
          {cfg.copyPhrase}
        </span>

        {/* Navigation Links */}
        {/* <div className="flex space-x-6 mt-4 md:mt-0">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={`${cfg.text} ${cfg.hover}`}>
              {label}
            </Link>
          ))}
        </div> */}
      </div>
    </footer>
  );
}
