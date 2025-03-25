'use client';

import PageHeader from '@/components/ui/page-header';
import axios from 'axios';
import { Badge, Card, Spinner, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { 
  HiOutlineChatAlt2, 
  HiOutlineClock, 
  HiOutlineMail,
  HiMailOpen,
  HiSearch,
  HiEye,
  HiChevronLeft,
  HiFilter
} from 'react-icons/hi';
import Link from 'next/link';

export default function LogLaporanPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const resUser = await axios.get('/api/auth/me');
        const userId = resUser.data.user.id;

        const res = await axios.get(`/api/reports?userId=${userId}`);
        setReports(res.data);
      } catch (error) {
        console.error('Gagal mengambil laporan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'gray';
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return 'success';
    if (statusLower === 'proses') return 'warning';
    if (statusLower === 'ditolak') return 'failure';
    if (statusLower === 'pending') return 'info';
    return 'gray';
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || report.bupatiStatus === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 bg-blue-50">
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <Spinner size="xl" />
          <span className="mt-4">Memuat riwayat laporan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6 border-t-4 border-blue-500 shadow-md">
          <div className="flex items-center">
            <Link href="/pelapor/dashboard" className="mr-4">
              <Button color="light" size="sm" className="rounded-full">
                <HiChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 flex items-center">
                <HiMailOpen className="mr-2 h-5 w-5 text-blue-600" />
                Riwayat Laporan Anda
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Lihat status dan riwayat laporan yang telah Anda kirim
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiFilter className="w-5 h-5 text-gray-500" />
              </div>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROSES">Proses</option>
                <option value="SELESAI">Selesai</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>
          </div>
        </Card>

        {filteredReports.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <HiOutlineMail className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">
                {searchQuery || filter !== 'ALL'
                  ? 'Tidak ada laporan yang cocok dengan kriteria pencarian.'
                  : 'Anda belum memiliki laporan.'}
              </p>
              <Link href="/pelapor/dashboard" className="mt-4">
                <Button color="blue">
                  Buat Laporan Baru
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const latestComment = report.comments?.find(
                (comment) => comment.user.role === 'BUPATI',
              );

              return (
                <Card
                  key={report.id}
                  className="border-l-4 hover:shadow-md transition-shadow overflow-hidden"
                  style={{ borderLeftColor: `var(--flowbite-${getStatusColor(report.bupatiStatus)}-500)` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {report.title}
                      </h3>
                      
                      <div className="flex items-center mt-2 gap-2">
                        <Badge color={getStatusColor(report.bupatiStatus)}>
                          {report.bupatiStatus}
                        </Badge>
                        
                        <span className="text-sm text-gray-500 flex items-center">
                          <HiOutlineClock className="mr-1 h-3 w-3" />
                          {new Date(report.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      
                      {latestComment ? (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-sm text-blue-800 flex items-center mb-1">
                            <HiOutlineChatAlt2 className="mr-1 h-4 w-4" />
                            Komentar Bupati:
                          </p>
                          <p className="text-sm italic text-gray-700">
                            &quot;{latestComment.comment}&quot;
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2 flex items-center">
                          <HiOutlineChatAlt2 className="mr-1 h-4 w-4" />
                          Belum ada komentar dari Bupati.
                        </p>
                      )}
                    </div>
                    
                    <Button color="light" size="xs" className="p-2">
                      <HiEye className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};