'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Spinner,
  Table,
  Button,
  TextInput,
  Select,
  Badge,
} from 'flowbite-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { HiDownload, HiFilter, HiSearch, HiCalendar } from 'react-icons/hi';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
// Fix jsPDF import and usage
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportJournal() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOpd, setFilterOpd] = useState('all');
  const [opdList, setOpdList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);

  // Check if API is ready
  useEffect(() => {
    // Small delay to ensure API routes are initialized
    const timer = setTimeout(() => {
      setIsApiReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch reports based on date range
  useEffect(() => {
    if (isApiReady) {
      fetchReports();
    }
  }, [startDate, endDate, isApiReady]);

  // Fetch OPD list for filtering
  useEffect(() => {
    if (isApiReady) {
      fetchOpdList();
    }
  }, [isApiReady]);

  const fetchOpdList = async () => {
    try {
      const response = await fetch('/api/opd', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOpdList(data);
      } else {
        console.error('Failed to fetch OPD list: Server error');
      }
    } catch (error) {
      console.error('Failed to fetch OPD list:', error);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      // Using try-catch to handle network errors
      const response = await fetch(
        `/api/reports/jurnal?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        },
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        toast.error(
          `Gagal memuat data laporan: ${errorData.error || 'Error server'}`,
        );
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      // More descriptive error message
      toast.error(
        'Terjadi kesalahan jaringan saat memuat data. Silakan coba lagi.',
      );

      // If there's a network error, provide empty data instead of failing
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter reports based on search term, status, and OPD
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.opd?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || report.bupatiStatus === filterStatus;

    const matchesOpd =
      filterOpd === 'all' ||
      (filterOpd === 'none' && !report.opdId) ||
      report.opdId === parseInt(filterOpd);

    return matchesSearch && matchesStatus && matchesOpd;
  });

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROSES':
        return 'info';
      case 'SELESAI':
        return 'success';
      case 'DITOLAK':
        return 'failure';
      default:
        return 'gray';
    }
  };

  // Export to Excel
  // Export to Excel with more complete data
  const exportToExcel = () => {
    if (filteredReports.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    try {
      const dataToExport = filteredReports.map((report) => ({
        'ID Laporan': report.id,
        'Judul Laporan': report.title || '-',
        Deskripsi:
          report.description?.substring(0, 100) +
            (report.description?.length > 100 ? '...' : '') || '-',
        'Nama Pelapor': report.user?.name || '-',
        'Email Pelapor': report.user?.email || '-',
        'OPD Ditugaskan': report.opd?.name || 'Belum ditugaskan',
        Kategori: report.category || '-',
        StatusBupati: report.bupatiStatus || '-',
        StatusOPD: report.opdStatus || '-',
        Lokasi: report.location || '-',
        'Kontak Pelapor': report.user?.contactNumber || '-',
        Prioritas: report.priority || 'Normal',
        'Tanggal Dibuat': format(
          new Date(report.createdAt),
          'dd MMMM yyyy HH:mm',
          {
            locale: id,
          },
        ),
        'Terakhir Diupdate': format(
          new Date(report.updatedAt || report.createdAt),
          'dd MMMM yyyy HH:mm',
          { locale: id },
        ),
        'Balasan Admin': report.adminResponse || '-',
        'Balasan OPD': report.opdResponse || '-',
        'Tanggal Selesai': report.completedAt
          ? format(new Date(report.completedAt), 'dd MMMM yyyy HH:mm', {
              locale: id,
            })
          : '-',
        'Tanggal Ditolak': report.rejectedAt
          ? format(new Date(report.rejectedAt), 'dd MMMM yyyy HH:mm', {
              locale: id,
            })
          : '-',
        'Alasan Penolakan': report.rejectedReason || '-',
      }));

      // Set column widths by creating a worksheet with specific column properties
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // Adjust column widths
      const colWidths = [
        { wch: 10 }, // ID Laporan
        { wch: 40 }, // Judul Laporan
        { wch: 50 }, // Deskripsi
        { wch: 25 }, // Nama Pelapor
        { wch: 25 }, // Email Pelapor
        { wch: 30 }, // OPD Ditugaskan
        { wch: 15 }, // Kategori
        { wch: 12 }, // Status Bupati
        { wch: 12 }, // Status OPD
        { wch: 30 }, // Lokasi
        { wch: 20 }, // Kontak Pelapor
        { wch: 12 }, // Prioritas
        { wch: 20 }, // Tanggal Dibuat
        { wch: 20 }, // Terakhir Diupdate
        { wch: 50 }, // Balasan Admin
        { wch: 50 }, // Balasan OPD
        { wch: 20 }, // Tanggal Selesai
        { wch: 20 }, // Tanggal Ditolak
        { wch: 30 }, // Alasan Penolakan
      ];

      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Jurnal Laporan');

      // Generate filename with date range
      const fileName = `Jurnal_Laporan_Lengkap_${format(startDate, 'dd-MM-yyyy')}_to_${format(endDate, 'dd-MM-yyyy')}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success('Data lengkap berhasil diekspor ke Excel');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Gagal mengekspor data ke Excel');
    }
  };

  // Export to PDF with more complete data
  // Fix for exportToPdf function
  // Fix for exportToPdf function
  const exportToPdf = () => {
    if (filteredReports.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    try {
      // Create new document with proper import
      const doc = new jsPDF('landscape'); // Use landscape for more columns

      // Add header with logo or title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(
        'JURNAL LAPORAN PENGADUAN MASYARAKAT',
        doc.internal.pageSize.width / 2,
        15,
        { align: 'center' },
      );

      // Add subtitle
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Laporan Pengaduan E-Lapor Kabupaten Kupang',
        doc.internal.pageSize.width / 2,
        22,
        { align: 'center' },
      );

      // Add date range
      doc.setFontSize(10);
      doc.text(
        `Periode: ${format(startDate, 'dd MMMM yyyy', { locale: id })} - ${format(endDate, 'dd MMMM yyyy', { locale: id })}`,
        doc.internal.pageSize.width / 2,
        29,
        { align: 'center' },
      );

      // Add timestamp
      doc.setFontSize(8);
      doc.text(
        `Dicetak pada: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`,
        doc.internal.pageSize.width - 15,
        10,
        { align: 'right' },
      );

      // Define the columns for the main table
      const mainColumns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Judul Laporan', dataKey: 'title' },
        { header: 'Pelapor', dataKey: 'reporter' },
        { header: 'OPD', dataKey: 'opd' },
        { header: 'Kategori', dataKey: 'category' },
        { header: 'Status Bupati', dataKey: 'statusBupati' },
        { header: 'Status OPD', dataKey: 'statusOpd' },
        { header: 'Tgl Dibuat', dataKey: 'created' },
        { header: 'Tgl Update', dataKey: 'updated' },
      ];

      // Prepare data for main table
      const mainData = filteredReports.map((report) => ({
        id: report.id.toString(),
        title:
          report.title?.substring(0, 40) +
            (report.title?.length > 40 ? '...' : '') || '-',
        reporter: report.user?.name || '-',
        opd: report.opd?.name || 'Belum ditugaskan',
        category: report.category || '-',
        statusBupati: report.bupatiStatus || '-',
        statusOpd: report.opdStatus || '-',
        created: format(new Date(report.createdAt), 'dd/MM/yyyy'),
        updated: format(
          new Date(report.updatedAt || report.createdAt),
          'dd/MM/yyyy',
        ),
      }));

      // Generate main table
      autoTable(doc, {
        startY: 35,
        head: [mainColumns.map((col) => col.header)],
        body: mainData.map((row) =>
          mainColumns.map((col) => row[col.dataKey] || '-'),
        ),
        theme: 'grid',
        headStyles: {
          fillColor: [60, 60, 150],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 10 }, // ID
          1: { cellWidth: 50 }, // Judul
          2: { cellWidth: 25 }, // Pelapor
          3: { cellWidth: 35 }, // OPD
          4: { cellWidth: 20 }, // Kategori
          5: { cellWidth: 20 }, // Status bupati
          6: { cellWidth: 20 }, // Status opd
          7: { cellWidth: 20 }, // Tgl Dibuat
          8: { cellWidth: 20 }, // Tgl Update
        },
      });

      // For each report, add detailed information on new pages
      let pageCount = 1;

      filteredReports.forEach((report, index) => {
        // Add a new page for each report's details
        doc.addPage();
        pageCount++;

        // Report header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Detail Laporan #${report.id}`, 14, 15);

        // Basic info table
        const basicInfoData = [
          ['Judul Laporan', `: ${report.title || '-'}`],
          ['ID Laporan', `: ${report.id}`],
          [
            'Tanggal Dibuat',
            `: ${format(new Date(report.createdAt), 'dd MMMM yyyy HH:mm', { locale: id })}`,
          ],
          ['Status Bupati', `: ${report.bupatiStatus || '-'}`],
          ['Status OPD', `: ${report.opdStatus || '-'}`],
          ['Kategori', `: ${report.category || '-'}`],
          ['Prioritas', `: ${report.priority || 'Normal'}`],
          ['Lokasi', `: ${report.location || '-'}`],
        ];

        // Track Y position manually instead of relying on doc.previousAutoTable
        let currentY = 20;

        autoTable(doc, {
          startY: currentY,
          body: basicInfoData,
          theme: 'plain',
          styles: { fontSize: 10, cellPadding: 1 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40 },
            1: { cellWidth: 150 },
          },
          didDrawPage: (data) => {
            currentY = data.cursor.y + 10;
          },
        });

        // Pelapor info table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Informasi Pelapor', 14, currentY);

        const pelaporData = [
          ['Nama', `: ${report.user?.name || '-'}`],
          ['Email', `: ${report.user?.email || '-'}`],
          ['Kontak', `: ${report.user?.contactNumber || '-'}`],
        ];

        autoTable(doc, {
          startY: currentY + 5,
          body: pelaporData,
          theme: 'plain',
          styles: { fontSize: 10, cellPadding: 1 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40 },
            1: { cellWidth: 150 },
          },
          didDrawPage: (data) => {
            currentY = data.cursor.y + 10;
          },
        });

        // Description section
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Deskripsi Laporan', 14, currentY);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Handle multiline description text with word wrap
        const textLines = doc.splitTextToSize(report.description || '-', 270);
        doc.text(textLines, 14, currentY + 5);

        // Calculate Y position after description
        currentY = currentY + 10 + textLines.length * 5;

        // Response sections
        if (report.adminResponse) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Balasan Admin', 14, currentY);

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const adminResponseLines = doc.splitTextToSize(
            report.adminResponse,
            270,
          );
          doc.text(adminResponseLines, 14, currentY + 5);

          currentY += 10 + adminResponseLines.length * 5;
        }

        if (report.opdResponse) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Balasan OPD', 14, currentY);

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const opdResponseLines = doc.splitTextToSize(report.opdResponse, 270);
          doc.text(opdResponseLines, 14, currentY + 5);

          currentY += 10 + opdResponseLines.length * 5;
        }

        // Timeline table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Timeline Pengaduan', 14, currentY);

        const timelineData = [
          [
            'Tanggal Dibuat',
            format(new Date(report.createdAt), 'dd MMMM yyyy HH:mm', {
              locale: id,
            }),
          ],
        ];

        if (report.updatedAt && report.updatedAt !== report.createdAt) {
          timelineData.push([
            'Terakhir Diupdate',
            format(new Date(report.updatedAt), 'dd MMMM yyyy HH:mm', {
              locale: id,
            }),
          ]);
        }

        if (report.opdAssignedAt) {
          timelineData.push([
            'Ditugaskan ke OPD',
            format(new Date(report.opdAssignedAt), 'dd MMMM yyyy HH:mm', {
              locale: id,
            }),
          ]);
        }

        if (report.completedAt) {
          timelineData.push([
            'Selesai',
            format(new Date(report.completedAt), 'dd MMMM yyyy HH:mm', {
              locale: id,
            }),
          ]);
        }

        if (report.rejectedAt) {
          timelineData.push([
            'Ditolak',
            format(new Date(report.rejectedAt), 'dd MMMM yyyy HH:mm', {
              locale: id,
            }),
          ]);
          if (report.rejectedReason) {
            timelineData.push(['Alasan Penolakan', report.rejectedReason]);
          }
        }

        autoTable(doc, {
          startY: currentY + 5,
          head: [['Event', 'Waktu']],
          body: timelineData,
          theme: 'striped',
          headStyles: { fillColor: [60, 60, 150] },
          styles: { fontSize: 9 },
        });

        // Add page number
        doc.setFontSize(8);
        doc.text(
          `Page ${pageCount} of ${filteredReports.length + 1}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10,
        );
      });

      // Add page numbers to first page
      doc.setPage(1);
      doc.setFontSize(8);
      doc.text(
        `Page 1 of ${filteredReports.length + 1}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10,
      );

      const fileName = `Jurnal_Laporan_Lengkap_${format(startDate, 'dd-MM-yyyy')}_to_${format(endDate, 'dd-MM-yyyy')}.pdf`;
      doc.save(fileName);
      toast.success('Data lengkap berhasil diekspor ke PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Gagal mengekspor data ke PDF: ' + error.message);
    }
  };
  // Add date validation function
  const handleDateChange = (date, type) => {
    if (type === 'start') {
      // If start date is after end date, show error
      if (date > endDate) {
        toast.error('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
        return;
      }
      setStartDate(date);
    } else {
      // If end date is before start date, show error
      if (date < startDate) {
        toast.error('Tanggal akhir tidak boleh lebih kecil dari tanggal awal');
        return;
      }
      setEndDate(date);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Jurnal Laporan Pengaduan
      </h1>

      <Card className="overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Date Range Selector */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex items-center gap-2">
                <HiCalendar className="text-gray-500" />
                <span className="whitespace-nowrap">Rentang Tanggal:</span>
              </div>
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => handleDateChange(date, 'start')}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()} // Prevents selecting future dates
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <span>to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => handleDateChange(date, 'end')}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()} // Prevents selecting future dates
                  dateFormat="dd/MM/yyyy"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                color="gray"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <HiFilter className="mr-2 h-5 w-5" />
                Filter
              </Button>
              <Button color="success" size="sm" onClick={exportToExcel}>
                <FaFileCsv className="mr-2 h-5 w-5" />
                Export Excel
              </Button>
              <Button color="failure" size="sm" onClick={exportToPdf}>
                <FaFilePdf className="mr-2 h-5 w-5" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          {showFilters && (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="max-w-[200px]"
              >
                <option value="all">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROSES">Proses</option>
                <option value="SELESAI">Selesai</option>
                <option value="DITOLAK">Ditolak</option>
              </Select>

              <Select
                value={filterOpd}
                onChange={(e) => setFilterOpd(e.target.value)}
                className="max-w-[250px]"
              >
                <option value="all">Semua OPD</option>
                <option value="none">Belum Ditugaskan</option>
                {opdList.map((opd) => (
                  <option key={opd.id} value={opd.id}>
                    {opd.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Results Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredReports.length} dari total {reports.length}{' '}
            laporan ({format(startDate, 'dd MMMM yyyy', { locale: id })} -{' '}
            {format(endDate, 'dd MMMM yyyy', { locale: id })})
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Judul</Table.HeadCell>
                <Table.HeadCell>Pelapor</Table.HeadCell>
                <Table.HeadCell>OPD Terkait</Table.HeadCell>
                <Table.HeadCell>Kategori</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Tanggal</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <Table.Row
                      key={report.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {report.id}
                      </Table.Cell>
                      <Table.Cell className="max-w-[300px] truncate">
                        {report.title}
                      </Table.Cell>
                      <Table.Cell>{report.user?.name || '-'}</Table.Cell>
                      <Table.Cell>
                        {report.opd?.name || (
                          <span className="text-gray-500 italic">
                            Belum ditugaskan
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell>{report.category || '-'}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={getStatusColor(report.bupatiStatus)}
                          className="whitespace-nowrap"
                        >
                          {report.bupatiStatus || 'UNKNOWN'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        {format(new Date(report.createdAt), 'dd MMM yyyy', {
                          locale: id,
                        })}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={7} className="text-center py-4">
                      <div className="flex flex-col items-center justify-center p-4">
                        <p className="text-gray-500 dark:text-gray-400">
                          Tidak ada data laporan yang ditemukan
                        </p>
                        <Button
                          color="gray"
                          size="xs"
                          className="mt-2"
                          onClick={fetchReports}
                        >
                          Muat Ulang
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
