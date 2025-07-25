'use client';

import { usePathname } from 'next/navigation';
import Head from 'next/head';
import pageMetadata from '@/lib/seo/pageMetadata'; // import dari file yang kamu buat

export default function DynamicMetadata() {
  const pathname = usePathname();
  const meta = pageMetadata[pathname] || {
    title: 'Lapor Kaka Bupati',
    description: 'Sampaikan laporan Anda melalui Lapor Kaka Bupati.',
  };

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
    </Head>
  );
}
