import { Badge, Tooltip } from 'flowbite-react';
import { HiOutlineClock, HiCheckCircle } from 'react-icons/hi';
import { truncateText } from '@/utils/common';

export const getColumns = () => [
  {
    header: 'Subjek & Pelapor',
    accessor: 'title',
    width: 'min-w-[350px] max-w-md',
    gridSection: 'header',
    gridHighlight: true,
    cell: (report) => (
      <div className="space-y-2">
        {/* Subjek */}
        <div className="flex items-center gap-2">
          <Tooltip content={report.title} style="light">
            <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {truncateText(report.title, 35)}
            </span>
          </Tooltip>
          {!report.isReadByBupati ? (
            <Tooltip content="Belum Dibaca oleh Bupati" placement="right">
              <HiOutlineClock className="text-yellow-500 w-4 h-4 flex-shrink-0" />
            </Tooltip>
          ) : (
            <Tooltip content="Sudah Dibaca oleh Bupati" placement="right">
              <HiCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
            </Tooltip>
          )}
        </div>

        {/* Pelapor */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Pelapor:</span>{' '}
          <Tooltip content={report.user?.name || 'Anonim'} style="light">
            <span className="truncate">{report.user?.name || 'Anonim'}</span>
          </Tooltip>
        </div>
      </div>
    ),
    gridBadge: {
      show: (r) => !r.isReadByBupati,
      text: 'Baru',
      colorClass:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
  },

  {
    header: 'Kategori & Deskripsi',
    accessor: 'category',
    width: 'min-w-[300px] max-lg',
    gridSection: 'header',
    cell: (report) => (
      <div className="space-y-2">
        {/* Kategori */}
        <div className="text-xs">
          <span className="font-medium text-gray-600 dark:text-gray-300">Kategori:</span>
          <div className="mt-0.5">
            <Tooltip
              content={report.category || 'Tidak ada kategori'}
              style="light"
              animation="duration-300"
            >
              <div className="truncate text-sm text-gray-700 dark:text-gray-300 cursor-help">
                {truncateText(report.category, 25)}
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="text-xs">
          <span className="font-medium text-gray-600 dark:text-gray-300">Deskripsi:</span>
          <div className="mt-0.5">
            <Tooltip
              content={report.description || 'Tidak ada deskripsi'}
              style="light"
              animation="duration-300"
            >
              <div className="truncate text-sm text-gray-700 dark:text-gray-300 cursor-help">
                {truncateText(report.description, 35)}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    ),
  },

  {
    header: 'OPD Terkait',
    accessor: 'opd.name',
    width: 'min-w-[150px] max-w-[200px]',
    gridSection: 'header',
    cell: (report) => (
      <Tooltip content={report.opd?.name || '-'} style="light">
        <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
          {truncateText(report.opd?.name || '-', 20)}
        </div>
      </Tooltip>
    ),
  },

  {
    header: 'Status',
    accessor: 'bupatiStatus',
    width: 'min-w-[160px]',
    gridSection: 'header',
    cell: (report) => (
      <div className="flex flex-col gap-1">
        <Badge
          color={
            report.bupatiStatus === 'SELESAI'
              ? 'green'
              : report.bupatiStatus === 'PROSES'
                ? 'yellow'
                : report.bupatiStatus === 'DITOLAK'
                  ? 'red'
                  : 'gray'
          }
          className="w-fit text-xs"
        >
          Bupati: {report.bupatiStatus}
        </Badge>
        <Badge
          color={
            report.opdStatus === 'SELESAI'
              ? 'green'
              : report.opdStatus === 'PROSES'
                ? 'yellow'
                : report.opdStatus === 'DITOLAK'
                  ? 'red'
                  : 'gray'
          }
          className="w-fit text-xs"
        >
          OPD: {report.opdStatus}
        </Badge>
      </div>
    ),
  },

  {
    header: 'Tanggal',
    accessor: 'createdAt',
    width: 'min-w-[110px]',
    gridSection: 'footer',
    cell: (report) =>
      new Date(report.createdAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  },
];
