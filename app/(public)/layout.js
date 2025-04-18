import Header from '@/components/partials/header';
import '../globals.css';

export const metadata = {
  title: 'LAPOR KK BUPATI',
  description: 'Sampaikan laporan Anda melalui LAPOR KK BUPATI',
};

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-indigo-100">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
}