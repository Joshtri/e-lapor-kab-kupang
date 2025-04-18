'use client';

import { Badge, Button, Card } from 'flowbite-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { BsBuildings, BsPersonCircle } from 'react-icons/bs';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiClock,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPrinter,
  FiUser,
  FiXCircle,
} from 'react-icons/fi';

// Define the Report type
const Report = {
  id: '',
  title: '',
  description: '',
  createdAt: '',
  opdStatus: '',
  opdResponse: '',
  opdUpdatedAt: '',
  bupatiStatus: '',
  bupatiResponse: '',
  bupatiUpdatedAt: '',
  image: '',
  user: {
    name: '',
  },
  opd: {
    name: '',
    email: '',
    telp: '',
    alamat: '',
  },
};

export default function ReportDetailPage() {
  const router = useRouter();

  const { id } = useParams(); // ambil dari [id]/page.js misal /adm/report-warga/[id]
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${id}`);
        const data = await res.json();
        setReport(data);
      } catch (error) {
        console.error('Gagal ambil data laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);
  // ✅ Hindari error render saat report belum ready
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!report)
    return (
      <div className="text-center py-10 text-red-500">
        Laporan tidak ditemukan.
      </div>
    );

  const getStatusIcon = (status) => {
    if (!status) return FiAlertCircle;

    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return FiCheckCircle;
    if (statusLower === 'proses') return FiClock;
    if (statusLower === 'ditolak') return FiXCircle;
    return FiAlertCircle;
  };

  const getStatusColor = (status) => {
    if (!status) return 'secondary';

    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return 'success';
    if (statusLower === 'proses') return 'warning';
    if (statusLower === 'ditolak') return 'destructive';
    if (statusLower === 'pending') return 'secondary';
    return 'secondary';
  };

  // Function to handle printing the report
  const handlePrintReport = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate the print-friendly content
    const printContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan: ${report.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
          }
          .title {
            font-size: 22px;
            font-weight: bold;
            margin: 20px 0 10px;
          }
          .subtitle {
            font-size: 18px;
            font-weight: bold;
            margin: 15px 0 10px;
            color: #4b5563;
          }
          .info-row {
            display: flex;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
          }
          .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
          }
          .status-success {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-warning {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-destructive {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .status-secondary {
            background-color: #f3f4f6;
            color: #4b5563;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          .description {
            white-space: pre-line;
            margin: 15px 0;
            padding: 10px;
            background-color: #f9fafb;
            border-radius: 4px;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none;
            }
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Sistem Pelaporan Masyarakat</div>
          <div>Laporan Pengaduan Masyarakat</div>
        </div>
        
        <div class="title">${report.title}</div>
        
        <div class="section">
          <div class="info-row">
            <div class="info-label">Nomor Laporan:</div>
            <div>${report.id || '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tanggal Dibuat:</div>
            <div>${new Date(report.createdAt).toLocaleString('id-ID')}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Pelapor:</div>
            <div>${report.user?.name || '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">OPD Tujuan:</div>
            <div>${report.opd?.name || '-'}</div>
          </div>
        </div>
        
        <div class="subtitle">Isi Laporan</div>
        <div class="description">${report.description}</div>
        
        <div class="subtitle">Status Penanganan</div>
        <div class="section">
          <div class="info-row">
            <div class="info-label">Status OPD:</div>
            <div>
              <span class="status status-${getStatusColor(report.opdStatus)}">
                ${report.opdStatus || 'PENDING'}
              </span>
            </div>
          </div>
          ${
            report.opdResponse
              ? `
          <div class="info-row">
            <div class="info-label">Tanggapan OPD:</div>
            <div>${report.opdResponse}</div>
          </div>
          `
              : ''
          }
          
          <div class="info-row">
            <div class="info-label">Status Bupati:</div>
            <div>
              <span class="status status-${getStatusColor(report.bupatiStatus)}">
                ${report.bupatiStatus || 'PENDING'}
              </span>
            </div>
          </div>
          ${
            report.bupatiResponse
              ? `
          <div class="info-row">
            <div class="info-label">Tanggapan Bupati:</div>
            <div>${report.bupatiResponse}</div>
          </div>
          `
              : ''
          }
        </div>
        
        <div class="footer">
          <p>Dokumen ini dicetak pada ${new Date().toLocaleString('id-ID')}</p>
          <p>Sistem Pelaporan Masyarakat © ${new Date().getFullYear()}</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print(); setTimeout(() => window.close(), 500);" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            Cetak Sekarang
          </button>
        </div>
      </body>
      </html>
    `;

    // Write the content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for resources to load then print
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  const StatusBadge = ({ status }) => (
    <Badge
      color={
        getStatusColor(status) === 'secondary' ? 'gray' : getStatusColor(status)
      }
    >
      {status || 'PENDING'}
    </Badge>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button color="light" onClick={() => router.back()}>
          <FiChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <FiFileText className="text-blue-600 h-6 w-6" />
          </div>
          Detail Laporan
        </h1>

        {report.opdStatus?.toLowerCase() !== 'ditolak' &&
          report.bupatiStatus?.toLowerCase() !== 'ditolak' && (
            <Button onClick={handlePrintReport}>
              <FiPrinter className="mr-2 h-4 w-4" />
              Cetak Laporan
            </Button>
          )}
      </div>

      <div className="space-y-6">
        {/* Main Report Card */}
        <Card>
          <div className="p-6">
            <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{report.title}</h2>
                  <div className="flex items-center mt-2 text-gray-600">
                    <FiUser className="mr-2 h-4 w-4" />
                    <span>
                      Pelapor:{' '}
                      <span className="font-medium">{report.user?.name}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 flex items-center">
                    <FiCalendar className="text-blue-500 mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {new Date(report.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(report.createdAt).toLocaleTimeString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
              <p className="whitespace-pre-line">{report.description}</p>
            </div>

            {/* Status Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {[
                {
                  label: 'OPD Terkait',
                  icon: <BsBuildings className="h-5 w-5" />,
                  status: report.opdStatus,
                },
                {
                  label: 'Bupati',
                  icon: <BsPersonCircle className="h-5 w-5" />,
                  status: report.bupatiStatus,
                },
              ].map((step) => (
                <div
                  key={step.label}
                  className={`flex-1 border-2 border-dashed rounded-lg p-3 bg-${getStatusColor(step.status)}-50 border-${getStatusColor(step.status)}-200`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-2 bg-${getStatusColor(step.status)}-100 text-${getStatusColor(step.status)}-700`}
                      >
                        {step.icon}
                      </div>
                      <span className="font-semibold">{step.label}</span>
                    </div>
                    <StatusBadge status={step.status} />
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-${getStatusColor(step.status)}-500`}
                      style={{
                        width:
                          step.status?.toLowerCase() === 'selesai'
                            ? '100%'
                            : step.status?.toLowerCase() === 'proses'
                              ? '50%'
                              : step.status?.toLowerCase() === 'ditolak'
                                ? '100%'
                                : '10%',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* OPD Information */}
        <Card className="border-l-4 border-blue-500">
          <div className="p-6">
            <div className="flex items-start">
              <div className="mr-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BsBuildings className="text-blue-600 h-6 w-6" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">OPD yang dituju:</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiArrowRight className="text-gray-500 mr-2 h-4 w-4" />
                    <span className="font-medium">
                      {report.opd?.name ?? '-'}
                    </span>
                  </div>

                  {report.opd?.email && (
                    <div className="flex items-center">
                      <FiMail className="text-gray-500 mr-2 h-4 w-4" />
                      <span>{report.opd.email}</span>
                    </div>
                  )}

                  {report.opd?.telp && (
                    <div className="flex items-center">
                      <FiPhone className="text-gray-500 mr-2 h-4 w-4" />
                      <span>{report.opd.telp}</span>
                    </div>
                  )}

                  {report.opd?.alamat && (
                    <div className="flex items-center">
                      <FiMapPin className="text-gray-500 mr-2 h-4 w-4" />
                      <span>{report.opd.alamat}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FiClock className="mr-2 h-5 w-5 text-blue-600" />
              Riwayat Laporan
            </h3>

            <div className="space-y-6">
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="rounded-full p-1 bg-blue-100">
                    <FiFileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                </div>
                <div>
                  <time className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleString('id-ID')}
                  </time>
                  <h4 className="font-medium">Laporan Dibuat</h4>
                  <p className="text-sm text-gray-600">
                    Laporan telah dibuat dan dikirim ke OPD terkait
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`rounded-full p-1 bg-${getStatusColor(report.opdStatus)}-100`}
                  >
                    {React.createElement(getStatusIcon(report.opdStatus), {
                      className: `h-4 w-4 text-${getStatusColor(report.opdStatus)}-600`,
                    })}
                  </div>
                  <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                </div>
                <div>
                  <time className="text-xs text-gray-500">
                    {report.opdUpdatedAt
                      ? new Date(report.opdUpdatedAt).toLocaleString('id-ID')
                      : '-'}
                  </time>
                  <h4 className="font-medium">Respons OPD</h4>
                  <div>
                    <StatusBadge status={report.opdStatus} />
                    <p className="mt-1 text-sm text-gray-600">
                      {report.opdResponse ||
                        'Belum ada respons dari OPD terkait'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`rounded-full p-1 bg-${getStatusColor(report.bupatiStatus)}-100`}
                  >
                    {React.createElement(getStatusIcon(report.bupatiStatus), {
                      className: `h-4 w-4 text-${getStatusColor(report.bupatiStatus)}-600`,
                    })}
                  </div>
                </div>
                <div>
                  <time className="text-xs text-gray-500">
                    {report.bupatiUpdatedAt
                      ? new Date(report.bupatiUpdatedAt).toLocaleString('id-ID')
                      : '-'}
                  </time>
                  <h4 className="font-medium">Respons Bupati</h4>
                  <div>
                    <StatusBadge status={report.bupatiStatus} />
                    <p className="mt-1 text-sm text-gray-600">
                      {report.bupatiResponse || 'Belum ada respons dari Bupati'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {report.image && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Lampiran:</h4>
                <img
                  src={report.image || '/placeholder.svg'}
                  alt="Lampiran Laporan"
                  className="rounded-md max-w-sm"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
