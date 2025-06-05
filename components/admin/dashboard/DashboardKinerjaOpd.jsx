'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiOutlineDocumentDownload,
  HiOutlineOfficeBuilding,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineFolder,
  HiOutlineCalendar,
} from 'react-icons/hi';
import LoadingMail from '@/components/ui/loading/LoadingMail';

const DashboardKinerjaOpd = () => {
  const [summary, setSummary] = useState(null);
  const [list, setList] = useState([]);
  const [ranking, setRanking] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add header with mail theme
    doc.setFillColor(59, 130, 246); // Blue color
    doc.rect(0, 0, 210, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('Laporan Kinerja OPD', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

    doc.setDrawColor(220, 220, 220);
    doc.line(14, 32, 196, 32);

    const tableColumn = [
      'OPD',
      'Total',
      'Selesai',
      'Proses',
      'Ditolak',
      'Pending',
      'Rasio (%)',
      'Waktu Respon',
      'Waktu Selesai',
    ];

    const tableRows = list.map((item) => [
      item.name,
      item.totalReports,
      item.selesai,
      item.proses,
      item.ditolak,
      item.pending,
      item.completionRate,
      item.avgResponseTime,
      item.avgCompletionTime,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [235, 245, 255],
        textColor: [59, 130, 246],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    doc.save('kinerja-opd.pdf');
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        const [s, l, r, o, c, m] = await Promise.all([
          fetch('/api/reports/stats/admin-summary/opd?type=summary').then(
            (res) => res.json(),
          ),
          fetch('/api/reports/stats/admin-summary/opd?type=list').then((res) =>
            res.json(),
          ),
          fetch(
            '/api/reports/stats/admin-summary/opd?type=ranking&sortBy=completionRate',
          ).then((res) => res.json()),
          fetch('/api/reports/stats/admin-summary/opd?type=overdue').then(
            (res) => res.json(),
          ),
          fetch('/api/reports/stats/admin-summary/opd?type=categories').then(
            (res) => res.json(),
          ),
          fetch('/api/reports/stats/admin-summary/opd?type=monthlyTrend').then(
            (res) => res.json(),
          ),
        ]);

        setSummary(s);
        setList(l);
        setRanking(r);
        setOverdue(o);
        setCategories(c);
        setMonthlyTrend(m);
      } catch (error) {
        'Error fetching dashboard data:', error;
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  if (loading)
    return <LoadingMail />

  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <HiOutlineOfficeBuilding className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Kinerja OPD
          </h1>
        </div>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <HiOutlineDocumentDownload className="h-5 w-5" />
          Export ke PDF
        </button>
      </div>

      {/* Summary */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <HiOutlineMail className="mr-2 h-5 w-5 text-blue-500" />
          Ringkasan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card
            title="Total OPD"
            value={summary?.totalOpd ?? '-'}
            icon={<HiOutlineOfficeBuilding className="h-5 w-5" />}
            color="bg-blue-100 text-blue-600"
          />
          <Card
            title="Total Laporan"
            value={summary?.totalReports ?? '-'}
            icon={<HiOutlineMail className="h-5 w-5" />}
            color="bg-purple-100 text-purple-600"
          />
          <Card
            title="Laporan Selesai"
            value={summary?.selesai ?? '-'}
            icon={<HiOutlineCheckCircle className="h-5 w-5" />}
            color="bg-green-100 text-green-600"
          />
          <Card
            title="Laporan Ditolak"
            value={summary?.ditolak ?? '-'}
            icon={<HiOutlineExclamation className="h-5 w-5" />}
            color="bg-red-100 text-red-600"
          />
          <Card
            title="Rata-rata Respon"
            value={summary?.avgResponseTime ?? '-'}
            icon={<HiOutlineClock className="h-5 w-5" />}
            color="bg-orange-100 text-orange-600"
          />
        </div>
      </motion.section>

      {/* Ranking */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        {/* Envelope-like header */}
        <div className="h-1 bg-blue-500 absolute top-0 left-0 right-0"></div>

        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <HiOutlineCheckCircle className="mr-2 h-5 w-5 text-green-500" />
          Peringkat OPD
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
              <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                1
              </span>
              Top 3 OPD
            </h3>
            <ul className="space-y-3">
              {ranking?.top3?.length > 0 ? (
                ranking.top3.map((opd, i) => (
                  <li key={i} className="flex items-center">
                    <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-800 dark:text-gray-200 font-medium">
                        {opd.name}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${opd.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-3 font-bold text-blue-600 dark:text-blue-400">
                      {opd.completionRate}%
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400 italic">
                  Tidak ada data
                </li>
              )}
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
            <h3 className="font-medium text-red-800 dark:text-red-300 mb-3 flex items-center">
              <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                !
              </span>
              Bottom 3 OPD
            </h3>
            <ul className="space-y-3">
              {ranking?.bottom3?.length > 0 ? (
                ranking.bottom3.map((opd, i) => (
                  <li key={i} className="flex items-center">
                    <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-800 dark:text-gray-200 font-medium">
                        {opd.name}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-red-600 h-2.5 rounded-full"
                          style={{ width: `${opd.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-3 font-bold text-red-600 dark:text-red-400">
                      {opd.completionRate}%
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400 italic">
                  Tidak ada data
                </li>
              )}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Overdue */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        {/* Envelope-like header */}
        <div className="h-1 bg-orange-500 absolute top-0 left-0 right-0"></div>

        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <HiOutlineExclamation className="mr-2 h-5 w-5 text-orange-500" />
          Laporan Belum Ditangani &gt; 7 Hari
        </h2>
        {overdue.length === 0 ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30 text-center">
            <HiOutlineCheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
            <p className="text-green-800 dark:text-green-300 font-medium">
              Tidak ada laporan terlambat
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdue.map((opd) => (
              <div
                key={opd.opdId}
                className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30 flex items-center"
              >
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <HiOutlineClock className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {opd.name}
                  </div>
                  <div className="text-orange-600 dark:text-orange-400 font-bold">
                    {opd.overdueReports} laporan terlambat
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Kategori Terbanyak */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        {/* Envelope-like header */}
        <div className="h-1 bg-purple-500 absolute top-0 left-0 right-0"></div>

        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <HiOutlineFolder className="mr-2 h-5 w-5 text-purple-500" />
          Kategori Terbanyak per OPD
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((item) => (
            <div
              key={item.opdId}
              className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30 flex items-center"
            >
              <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <HiOutlineFolder className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {item.name}
                </div>
                <div className="text-purple-600 dark:text-purple-400">
                  <span className="font-bold">{item.topCategory}</span> (
                  {item.count} laporan)
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* List Tabel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        {/* Envelope-like header */}
        <div className="h-1 bg-blue-500 absolute top-0 left-0 right-0"></div>

        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <HiOutlineOfficeBuilding className="mr-2 h-5 w-5 text-blue-500" />
          Detail Kinerja Tiap OPD
        </h2>
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              <tr>
                <th className="p-3 text-left rounded-tl-lg">OPD</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Selesai</th>
                <th className="p-3 text-center">Proses</th>
                <th className="p-3 text-center">Ditolak</th>
                <th className="p-3 text-center">Pending</th>
                <th className="p-3 text-center">Rasio Selesai</th>
                <th className="p-3 text-center">Waktu Respon</th>
                <th className="p-3 text-center rounded-tr-lg">Waktu Selesai</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr
                  key={item.opdId}
                  className={`border-t hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                >
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3 text-center">{item.totalReports}</td>
                  <td className="p-3 text-center text-green-600 dark:text-green-400 font-medium">
                    {item.selesai}
                  </td>
                  <td className="p-3 text-center text-yellow-600 dark:text-yellow-400">
                    {item.proses}
                  </td>
                  <td className="p-3 text-center text-red-600 dark:text-red-400">
                    {item.ditolak}
                  </td>
                  <td className="p-3 text-center text-blue-600 dark:text-blue-400">
                    {item.pending}
                  </td>
                  <td className="p-3 text-center font-bold">
                    {item.completionRate}%
                  </td>
                  <td className="p-3 text-center">{item.avgResponseTime}</td>
                  <td className="p-3 text-center">{item.avgCompletionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Monthly Trend */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        {/* Envelope-like header */}
        <div className="h-1 bg-green-500 absolute top-0 left-0 right-0"></div>

        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <HiOutlineCalendar className="mr-2 h-5 w-5 text-green-500" />
          Tren Laporan per Bulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monthlyTrend.map((opd) => (
            <div
              key={opd.opdId}
              className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30"
            >
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <HiOutlineOfficeBuilding className="mr-2 h-5 w-5 text-green-600" />
                {opd.name}
              </h3>
              <ul className="space-y-2">
                {opd.monthlyData.map((m) => (
                  <li key={m.month} className="flex items-center">
                    <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <HiOutlineCalendar className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-700 dark:text-gray-300">
                        {m.month}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(m.count / Math.max(...opd.monthlyData.map((d) => d.count))) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-3 font-medium text-green-600 dark:text-green-400">
                      {m.count} laporan
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};
function Card({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-full ${color} mr-3`}>{icon}</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
      <p className="text-xl font-semibold text-gray-800 dark:text-white">
        {value}
      </p>

      {/* Envelope stamp-like decoration */}
      <div className="absolute bottom-2 right-2 opacity-10">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 12H16M12 8V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired
};

export default DashboardKinerjaOpd;
