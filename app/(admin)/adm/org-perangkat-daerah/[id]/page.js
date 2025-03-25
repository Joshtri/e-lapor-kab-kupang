'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Spinner, 
  Badge, 
  Card, 
  Button, 
  Avatar,
  Timeline,
  Breadcrumb,
  Alert
} from 'flowbite-react';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiMail, 
  HiPhone, 
  HiOfficeBuilding, 
  HiGlobe, 
  HiUser,
  HiDocumentText,
  HiExclamation,
  HiOutlineMailOpen,
  HiCalendar,
  HiLocationMarker
} from 'react-icons/hi';

export default function OrgPerangkatDaerahDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [opd, setOpd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOPDDetail();
  }, [id]);

  const fetchOPDDetail = async () => {
    try {
      const res = await axios.get(`/api/opd/${id}`);
      setOpd(res.data);
    } catch (err) {
      console.error('❌ Gagal ambil detail OPD:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-2 text-gray-600">Memuat data OPD...</p>
        </div>
      </div>
    );
  }

  if (!opd) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert color="failure" icon={HiExclamation}>
          <span className="font-medium">Data OPD tidak ditemukan.</span>
        </Alert>
        <div className="mt-4">
          <Link href="/adm/opd">
            <Button color="blue" size="sm">
              <HiArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar OPD
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (!status) return 'gray';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending')) return 'warning';
    if (statusLower.includes('proses')) return 'info';
    if (statusLower.includes('selesai')) return 'success';
    if (statusLower.includes('ditolak')) return 'failure';
    return 'blue';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-5">
        <Breadcrumb.Item href="/adm/org-perangkat-daerah" icon={HiArrowLeft}>
          Kembali ke Daftar OPD
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Detail OPD
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Main Envelope Card */}
      <Card className="mb-6 border-t-8 border-blue-500 shadow-lg overflow-hidden">
        {/* Stamp-like Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <HiOfficeBuilding className="text-blue-600 h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{opd.name}</h1>
              <Badge color="blue" className="mt-1">OPD</Badge>
            </div>
          </div>
          
          {/* Stamp-like Staff Section */}
          <div className="border-2 border-dashed border-blue-300 p-3 rounded-lg bg-blue-50 w-full md:w-auto">
            <div className="flex items-center">
              <HiUser className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-bold text-blue-700">Staff Terkait:</h3>
            </div>
            <div className="flex items-center mt-2">
              <Avatar 
                alt="Staff Avatar"
                rounded
                size="md"
                className="mr-3 border-2 border-blue-200"
              />
              <div>
                <p className="font-medium">{opd.staff?.name || 'Tidak tersedia'}</p>
                <p className="text-sm text-gray-500">Staff OPD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <HiMail className="mr-2 h-5 w-5 text-blue-600" />
            Informasi Kontak
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <HiMail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email:</p>
                <p className="text-gray-800">{opd.email || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <HiPhone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telepon:</p>
                <p className="text-gray-800">{opd.telp || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <HiLocationMarker className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Alamat:</p>
                <p className="text-gray-800">{opd.alamat || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <HiGlobe className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Website:</p>
                {opd.website ? (
                  <a href={opd.website} target="_blank" className="text-blue-600 hover:underline">
                    {opd.website}
                  </a>
                ) : (
                  <p className="text-gray-800">-</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Reports Section - Styled like mail/letters */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <HiDocumentText className="mr-2 h-5 w-5 text-blue-600" />
          Daftar Laporan Masuk
        </h2>
        <Badge color="gray">
          {opd.reports?.length || 0} Laporan
        </Badge>
      </div>

      {!opd.reports || opd.reports.length === 0 ? (
        <Card className="text-center py-8">
          <div className="flex flex-col items-center">
            <HiOutlineMailOpen className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">Belum ada laporan masuk.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {opd.reports.map((report) => (
            <Card 
              key={report.id} 
              className="border-l-4 hover:shadow-md transition-shadow" 
              style={{ borderLeftColor: `var(--flowbite-${getStatusColor(report.opdStatus)}-500)` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                  <p className="text-gray-600 mt-1">{report.description}</p>
                </div>
                <Badge color={getStatusColor(report.opdStatus)} size="sm" className="h-fit">
                  {report.opdStatus || 'Tidak ada status'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  <HiUser className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Pelapor: {report.user?.name || 'Anonim'}
                  </span>
                </div>
                {report.createdAt && (
                  <div className="flex items-center mt-2 sm:mt-0">
                    <HiCalendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button size="xs" color="gray" className="p-2">
                  <HiDocumentText className="w-4 h-4" />
                  <span className="ml-1">Detail</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Timeline for report history - Optional */}
      {opd.reports && opd.reports.length > 0 && (
        <Card className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HiCalendar className="mr-2 h-5 w-5 text-blue-600" />
            Riwayat Laporan
          </h3>
          
          <Timeline>
            {opd.reports.map((report) => (
              <Timeline.Item key={report.id}>
                <Timeline.Point icon={HiDocumentText} />
                <Timeline.Content>
                  <Timeline.Time>
                    {report.createdAt 
                      ? new Date(report.createdAt).toLocaleDateString('id-ID')
                      : 'Tanggal tidak tersedia'}
                  </Timeline.Time>
                  <Timeline.Title>{report.title}</Timeline.Title>
                  <Timeline.Body>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-600">{report.description}</p>
                      <div>
                        Status: <Badge color={getStatusColor(report.opdStatus)}>
                          {report.opdStatus || 'Tidak ada status'}
                        </Badge>
                      </div>
                    </div>
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      )}
    </div>
  );
}