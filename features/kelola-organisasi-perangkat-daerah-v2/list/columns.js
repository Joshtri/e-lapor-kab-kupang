import {
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiOutlinePhone,
} from 'react-icons/hi';
import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';

export const getColumns = () => [
  {
    header: 'Nama OPD',
    accessor: 'name',
    gridSection: 'header',
    gridHighlight: true,
    cell: (opd) => (
      <div className="flex flex-col gap-1">
        <TruncatedWithTooltip text={opd.name} length={40} />
        {opd.alamat && (
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <HiOutlineOfficeBuilding className="inline h-3 w-3" />
            {opd.alamat}
          </span>
        )}
      </div>
    ),
  },
  {
    header: 'Kontak',
    accessor: 'email',
    gridSection: 'header',
    cell: (opd) => (
      <div className="flex flex-col gap-1 text-sm">
        {opd.email && (
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <HiOutlineMail className="h-4 w-4 flex-shrink-0" />
            <TruncatedWithTooltip text={opd.email} length={20} />
          </span>
        )}
        {opd.telp && (
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <HiOutlinePhone className="h-4 w-4 flex-shrink-0" />
            {opd.telp}
          </span>
        )}
        {!opd.email && !opd.telp && <span className="text-gray-400">-</span>}
      </div>
    ),
  },

  {
    header: 'Jumlah Staff',
    accessor: 'staffCount',
    gridSection: 'header',
    cell: (opd) => (
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {opd._count.staff ?? 0}
      </span>
    ),
  },
  {
    header: 'Laporan',
    accessor: 'reports',
    gridSection: 'header',
    cell: (opd) => (
      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-full text-sm font-medium">
        {opd.reports?.length ?? 0}
      </span>
    ),
  },
  {
    header: 'Dibuat',
    accessor: 'createdAt',
    gridSection: 'header',
    cell: (opd) => {
      const date = new Date(opd.createdAt);
      return (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {date.toLocaleDateString('id-ID')}
        </span>
      );
    },
  },
];
