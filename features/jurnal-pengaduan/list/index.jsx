'use client';

import StatusBadge from '@/components/common/StatusBadge';
import ListGrid from '@/components/ui/datatable/ListGrid';
import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';
import { fetchJournalReports, fetchOpdList } from '@/services/reportService';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from 'flowbite-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export default function PengaduanJurnalList() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOpd, setFilterOpd] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  // Format dates for query
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  // Fetch journal reports using TanStack Query
  const {
    data: reports = [],
    isLoading: loadingReports,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['journalReports', formattedStartDate, formattedEndDate],
    queryFn: () => fetchJournalReports(formattedStartDate, formattedEndDate),
    onError: () => {
      toast.error('Gagal memuat data laporan.');
    },
  });

  // Fetch OPD list using TanStack Query
  const { data: opdList = [], isLoading: loadingOpd } = useQuery({
    queryKey: ['opdList'],
    queryFn: fetchOpdList,
    onError: () => {
      toast.error('Gagal memuat data OPD.');
    },
  });

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
      report.opdId === filterOpd;

    return matchesSearch && matchesStatus && matchesOpd;
  });

  // Define columns for ListGrid
  const columns = [
    {
      header: 'Subjek',
      accessor: 'title',
      width: 'w-2/5',
      cell: (r) => <TruncatedWithTooltip text={r.title} length={50} />,
    },
    {
      header: 'Status',
      accessor: 'bupatiStatus',
      width: 'w-1/5',
      cell: (r) => <StatusBadge bupati={r.bupatiStatus} />,
    },
    {
      header: 'OPD',
      accessor: 'opd.name',
      width: 'w-1/6',
      cell: (r) => (
        <TruncatedWithTooltip
          text={r.opd?.name || 'Belum ditugaskan'}
          length={20}
        />
      ),
    },
    {
      header: 'Tanggal',
      accessor: 'createdAt',
      width: 'w-1/5',
      cell: (r) => format(new Date(r.createdAt), 'dd MMM yyyy', { locale: id }),
    },
  ];

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

  // Handle date change with validation
  const handleDateChange = (date, type) => {
    if (type === 'start') {
      if (date > endDate) {
        toast.error('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
        return;
      }
      setStartDate(date);
    } else {
      if (date < startDate) {
        toast.error('Tanggal akhir tidak boleh lebih kecil dari tanggal awal');
        return;
      }
      setEndDate(date);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Date Range */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Jurnal Laporan Pengaduan
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {format(startDate, 'dd MMMM yyyy', { locale: id })} -{' '}
              {format(endDate, 'dd MMMM yyyy', { locale: id })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              color="success"
              size="sm"
              onClick={exportToExcel}
              className="flex items-center gap-2"
            >
              <FaFileCsv className="h-4 w-4" />
              Export Excel
            </Button>
            <Button
              color="failure"
              size="sm"
              onClick={exportToPdf}
              className="flex items-center gap-2"
            >
              <FaFilePdf className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rentang Tanggal:
          </span>
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date, 'start')}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <span className="text-gray-500">ke</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(date, 'end')}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ListGrid Component */}
      <ListGrid
        title="Daftar Laporan"
        searchBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={false}
        onRefreshClick={refetchReports}
        loading={loadingReports || loadingOpd}
        data={filteredReports}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        filters={[
          {
            type: 'select',
            label: 'Status',
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: 'all', label: 'Semua Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'PROSES', label: 'Proses' },
              { value: 'SELESAI', label: 'Selesai' },
              { value: 'DITOLAK', label: 'Ditolak' },
            ],
          },
          {
            type: 'select',
            label: 'OPD',
            value: filterOpd,
            onChange: setFilterOpd,
            options: [
              { value: 'all', label: 'Semua OPD' },
              { value: 'none', label: 'Belum Ditugaskan' },
              ...opdList.map((opd) => ({
                value: opd.id,
                label: opd.name,
              })),
            ],
          },
        ]}
        emptyMessage="Tidak ada laporan ditemukan untuk periode yang dipilih."
        emptyAction={
          <Button color="gray" onClick={() => refetchReports()}>
            Muat Ulang
          </Button>
        }
      />
    </div>
  );
}
