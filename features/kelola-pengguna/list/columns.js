import { HiOfficeBuilding, HiExclamationCircle } from 'react-icons/hi';

export const getColumns = (incompleteProfiles = []) => [
  {
    header: 'Nama',
    accessor: 'name',
    gridSection: 'header',
    gridHighlight: true,
    cell: (user) => {
      const isIncomplete = incompleteProfiles.includes(user.id);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>

          {user.role === 'OPD' && user.opd?.name && (
            <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
              <HiOfficeBuilding className="inline h-4 w-4" />
              {user.opd.name}
            </span>
          )}

          {isIncomplete && (
            <span className="text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
              <HiExclamationCircle className="inline h-4 w-4" />
              Profil instansi OPD belum lengkap
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: 'Email',
    accessor: 'email',
    gridSection: 'header',
    cell: (user) => user.email,
  },
  {
    header: 'Role',
    accessor: 'role',
    gridSection: 'header',
    cell: (user) => user.role,
  },
  {
    header: 'Instansi',
    accessor: 'opd.name',
    gridSection: 'header',
    cell: (user) => user.opd?.name || '-',
  },
];
