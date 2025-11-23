import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';

export const getColumns = () => [
  {
    header: 'Nama OPD',
    accessor: 'name',
    gridSection: 'header',
    gridHighlight: true,
    cell: (opd) => (
      <div className="flex flex-col">
        <TruncatedWithTooltip text={opd.name} length={25} />
        {opd.wilayah && (
          <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
            <HiOutlineOfficeBuilding className="inline h-4 w-4" />
            {opd.wilayah}
          </span>
        )}
      </div>
    ),
  },
  {
    header: 'Staff PJ',
    accessor: 'staff',
    gridSection: 'header',
    cell: (opd) => {
      if (!opd.staff || opd.staff.length === 0) {
        return '-';
      }
      return (
        <div className="flex flex-col gap-1">
          {opd.staff.map((person) => (
            <span key={person.id} className="text-sm">
              {person.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    header: 'Laporan',
    accessor: 'reports',
    gridSection: 'header',
    cell: (opd) => (
      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm font-medium">
        {opd.reports?.length ?? 0}
      </span>
    ),
  },
];
