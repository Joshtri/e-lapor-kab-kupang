'use client';
import { Card, Button } from 'flowbite-react';
import {
  HiClipboardList,
  HiCheckCircle,
  HiUserGroup,
  HiXCircle,
  HiClock,
  HiRefresh,
} from 'react-icons/hi';

export default function OpdIkhtisarTab({ data, onReload }) {
  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400 space-y-4">
        <p>Gagal memuat data ikhtisar.</p>
        {onReload && (
          <Button color="purple" onClick={onReload}>
            <HiRefresh className="mr-2 h-5 w-5" />
            Coba Lagi
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <p className="text-sm text-gray-500">Laporan Masuk</p>
        <p className="text-2xl font-bold">{data.totalMasuk}</p>
        <HiClipboardList className="w-6 h-6 text-blue-600" />
      </Card>
      <Card>
        <p className="text-sm text-gray-500">Selesai</p>
        <p className="text-2xl font-bold">{data.totalSelesai}</p>
        <HiCheckCircle className="w-6 h-6 text-green-600" />
      </Card>
      <Card>
        <p className="text-sm text-gray-500">Dalam Proses</p>
        <p className="text-2xl font-bold">{data.totalProses}</p>
        <HiClock className="w-6 h-6 text-yellow-600" />
      </Card>
      <Card>
        <p className="text-sm text-gray-500">Ditolak</p>
        <p className="text-2xl font-bold">{data.totalDitolak}</p>
        <HiXCircle className="w-6 h-6 text-red-600" />
      </Card>
      <Card>
        <p className="text-sm text-gray-500">Total Pelapor</p>
        <p className="text-2xl font-bold">{data.totalPelapor}</p>
        <HiUserGroup className="w-6 h-6 text-purple-600" />
      </Card>
      <Card>
        <p className="text-sm text-gray-500">Laporan Baru (24 jam)</p>
        <p className="text-2xl font-bold">{data.laporanBaru}</p>
      </Card>
    </div>
  );
}
