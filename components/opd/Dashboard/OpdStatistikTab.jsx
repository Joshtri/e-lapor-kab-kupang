'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'flowbite-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#6366F1',
  '#EC4899',
];

export default function OpdStatistikTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/reports/stats/chart/opd-chart');
      const result = res.data?.data || res.data;
      setData(result);
    } catch (err) {
      console.error('Gagal fetch data statistik OPD', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (loading || !data) {
    return (
      <div className="h-[300px] flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  const distribusiPrioritasArray = Object.entries(
    data.distribusiPrioritas || {},
  ).map(([priority, jumlah]) => ({ priority, jumlah }));

  return (
    <div className="space-y-4">
      {/* Grafik Jumlah Laporan per Bulan */}
      <Card>
        <p className="font-semibold text-lg mb-2">
          Grafik Jumlah Laporan per Bulan
        </p>
        <div className="h-[300px]">
          {data.laporanPerBulan?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.laporanPerBulan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jumlah" fill="#3B82F6" name="Jumlah Laporan" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center text-gray-500">
              Tidak ada data laporan per bulan.
            </p>
          )}
        </div>
      </Card>

      {/* Pie Chart Distribusi Kategori */}
      <Card>
        <p className="font-semibold text-lg mb-2">
          Distribusi Kategori Laporan
        </p>
        <div className="h-[300px] flex justify-center items-center">
          {data.kategoriDistribusi?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.kategoriDistribusi}
                  dataKey="jumlah"
                  nameKey="kategori"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.kategoriDistribusi.map((entry, index) => (
                    <Cell
                      key={`cell-kategori-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Tidak ada data kategori laporan.
            </p>
          )}
        </div>
      </Card>

      {/* Pie Chart Distribusi Prioritas */}
      <Card>
        <p className="font-semibold text-lg mb-2">
          Distribusi Prioritas Laporan
        </p>
        <div className="h-[300px] flex justify-center items-center">
          {distribusiPrioritasArray.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribusiPrioritasArray}
                  dataKey="jumlah"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {distribusiPrioritasArray.map((_, index) => (
                    <Cell
                      key={`cell-priority-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Tidak ada data prioritas laporan.
            </p>
          )}
        </div>
      </Card>

      {/* Jumlah Laporan Tertunda > 7 Hari */}
      <Card>
        <p className="font-semibold text-lg">Laporan Tertunda &gt; 7 Hari</p>
        <p className="text-2xl font-bold">
          {data.laporanTertundaLebih7Hari ?? 0}
        </p>
      </Card>

      {/* Waktu Rata-rata Penanganan */}
      <Card>
        <p className="font-semibold text-lg">Waktu Rata-rata Penanganan</p>
        <p className="text-2xl font-bold">
          {typeof data.avgHandlingTime === 'number'
            ? `${data.avgHandlingTime} hari`
            : '-'}
        </p>
      </Card>
    </div>
  );
}
