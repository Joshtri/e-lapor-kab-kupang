'use client';

import { Badge, Button, Card, Modal, Timeline, Avatar, Tooltip } from 'flowbite-react';
import { 
  HiOutlineClipboardList, 
  HiOutlineOfficeBuilding, 
  HiUser, 
  HiMail, 
  HiCalendar, 
  HiClock,
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
  HiArrowCircleRight,
  HiPhone,
  HiLocationMarker,
  HiPrinter
} from 'react-icons/hi';
import { MdPerson4 } from 'react-icons/md';
import { useRef } from 'react';

export default function ReportDetail({ report, isOpen, onClose }) {
  if (!report) return null;

  const getStatusIcon = (status) => {
    if (!status) return HiExclamationCircle;
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return HiCheckCircle;
    if (statusLower === 'proses') return HiClock;
    if (statusLower === 'ditolak') return HiXCircle;
    return HiExclamationCircle;
  };

  const getStatusColor = (status) => {
    if (!status) return 'gray';
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'selesai') return 'success';
    if (statusLower === 'proses') return 'warning';
    if (statusLower === 'ditolak') return 'failure';
    if (statusLower === 'pending') return 'gray';
    return 'gray';
  };

  // Function to handle printing the report
  const handlePrintReport = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
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
          .status-failure {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .status-gray {
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
          ${report.opdResponse ? `
          <div class="info-row">
            <div class="info-label">Tanggapan OPD:</div>
            <div>${report.opdResponse}</div>
          </div>
          ` : ''}
          
          <div class="info-row">
            <div class="info-label">Status Bupati:</div>
            <div>
              <span class="status status-${getStatusColor(report.bupatiStatus)}">
                ${report.bupatiStatus || 'PENDING'}
              </span>
            </div>
          </div>
          ${report.bupatiResponse ? `
          <div class="info-row">
            <div class="info-label">Tanggapan Bupati:</div>
            <div>${report.bupatiResponse}</div>
          </div>
          ` : ''}
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
    printWindow.onload = function() {
      printWindow.focus(); // Focus on the new window
      setTimeout(() => {
        printWindow.print(); // Trigger print dialog
      }, 250);
    };
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <Modal.Header className="border-b-4 border-blue-500">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <HiDocumentText className="text-blue-600 h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">Detail Laporan</span>
        </div>
      </Modal.Header>
      
      <Modal.Body className="space-y-6">
        {/* Main Report Card - Styled like a letter */}
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{report.title}</h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <HiUser className="mr-2 h-4 w-4" />
                  <span>Pelapor: <span className="font-medium">{report.user?.name}</span></span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 flex items-center">
                  <HiCalendar className="text-blue-500 mr-2 h-4 w-4" />
                  <span className="text-sm">
                    {new Date(report.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(report.createdAt).toLocaleTimeString('id-ID')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Report Content - Like letter content */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
            <p className="whitespace-pre-line">{report.description}</p>
          </div>
          
          {/* Stamp-like Status Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {[
              {
                label: 'OPD Terkait',
                icon: <HiOutlineOfficeBuilding className="h-5 w-5" />,
                status: report.opdStatus,
              },
              {
                label: 'Bupati',
                icon: <MdPerson4 className="h-5 w-5" />,
                status: report.bupatiStatus,
              },
            ].map((step) => (
              <div 
                key={step.label} 
                className={`flex-1 border-2 border-dashed rounded-lg p-3`}
                style={{
                  backgroundColor: `var(--flowbite-${getStatusColor(step.status)}-50, #f9fafb)`,
                  borderColor: `var(--flowbite-${getStatusColor(step.status)}-200, #e5e7eb)`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full mr-2" 
                      style={{
                        backgroundColor: `var(--flowbite-${getStatusColor(step.status)}-100, #f3f4f6)`,
                        color: `var(--flowbite-${getStatusColor(step.status)}-700, #374151)`
                      }}>
                      {step.icon}
                    </div>
                    <span className="font-semibold">{step.label}</span>
                  </div>
                  <Badge color={getStatusColor(step.status)} size="sm">
                    {step.status || 'PENDING'}
                  </Badge>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: step.status === 'SELESAI' ? '100%' : 
                             step.status === 'PROSES' ? '50%' : 
                             step.status === 'DITOLAK' ? '100%' : '10%',
                      backgroundColor: `var(--flowbite-${getStatusColor(step.status)}-500, #6b7280)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* OPD Information - Styled like an address on an envelope */}
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <HiOutlineOfficeBuilding className="text-blue-600 h-6 w-6" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">OPD yang dituju:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <HiArrowCircleRight className="text-gray-500 mr-2 h-4 w-4" />
                  <span className="font-medium">{report.opd?.name ?? '-'}</span>
                </div>
                
                {report.opd?.email && (
                  <div className="flex items-center">
                    <HiMail className="text-gray-500 mr-2 h-4 w-4" />
                    <span>{report.opd.email}</span>
                  </div>
                )}
                
                {report.opd?.telp && (
                  <div className="flex items-center">
                    <HiPhone className="text-gray-500 mr-2 h-4 w-4" />
                    <span>{report.opd.telp}</span>
                  </div>
                )}
                
                {report.opd?.alamat && (
                  <div className="flex items-center">
                    <HiLocationMarker className="text-gray-500 mr-2 h-4 w-4" />
                    <span>{report.opd.alamat}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Timeline - Mail journey */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <HiClock className="mr-2 h-5 w-5 text-blue-600" />
            Riwayat Laporan
          </h3>
          
          <Timeline>
            <Timeline.Item>
              <Timeline.Point icon={HiDocumentText} />
              <Timeline.Content>
                <Timeline.Time>
                  {new Date(report.createdAt).toLocaleString('id-ID')}
                </Timeline.Time>
                <Timeline.Title>Laporan Dibuat</Timeline.Title>
                <Timeline.Body>
                  Laporan telah dibuat dan dikirim ke OPD terkait
                </Timeline.Body>
              </Timeline.Content>
            </Timeline.Item>
            
            <Timeline.Item>
              <Timeline.Point icon={getStatusIcon(report.opdStatus)} />
              <Timeline.Content>
                <Timeline.Time>
                  {report.opdUpdatedAt ? new Date(report.opdUpdatedAt).toLocaleString('id-ID') : '-'}
                </Timeline.Time>
                <Timeline.Title>Respons OPD</Timeline.Title>
                <Timeline.Body>
                  <Badge color={getStatusColor(report.opdStatus)}>
                    {report.opdStatus || 'PENDING'}
                  </Badge>
                  <p className="mt-1 text-sm text-gray-600">
                    {report.opdResponse || 'Belum ada respons dari OPD terkait'}
                  </p>
                </Timeline.Body>
              </Timeline.Content>
            </Timeline.Item>
            
            <Timeline.Item>
              <Timeline.Point icon={getStatusIcon(report.bupatiStatus)} />
              <Timeline.Content>
                <Timeline.Time>
                  {report.bupatiUpdatedAt ? new Date(report.bupatiUpdatedAt).toLocaleString('id-ID') : '-'}
                </Timeline.Time>
                <Timeline.Title>Respons Bupati</Timeline.Title>
                <Timeline.Body>
                  <Badge color={getStatusColor(report.bupatiStatus)}>
                    {report.bupatiStatus || 'PENDING'}
                  </Badge>
                  <p className="mt-1 text-sm text-gray-600">
                    {report.bupatiResponse || 'Belum ada respons dari Bupati'}
                  </p>
                </Timeline.Body>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline>
        </Card>
      </Modal.Body>
      
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Tutup
        </Button>
        {report.opdStatus !== 'DITOLAK' && report.bupatiStatus !== 'DITOLAK' && (
          <Button color="blue" onClick={handlePrintReport}>
            <HiPrinter className="mr-2 h-4 w-4" />
            Cetak Laporan
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}