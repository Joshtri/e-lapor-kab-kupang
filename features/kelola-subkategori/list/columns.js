import { Badge } from 'flowbite-react';
import { HiViewList } from 'react-icons/hi';

export const getColumns = () => [
  {
    header: 'Nama Subkategori',
    accessor: 'name',
    gridSection: 'header',
    gridHighlight: true,
    cell: (subcategory) => (
      <div className="flex items-center gap-2">
        <HiViewList className="h-5 w-5 text-purple-600 flex-shrink-0" />
        <span className="font-medium text-gray-900 dark:text-white">
          {subcategory.name}
        </span>
      </div>
    ),
  },
  {
    header: 'Kategori',
    accessor: 'category',
    gridSection: 'header',
    cell: (subcategory) => (
      <Badge color="info">{subcategory.category?.name || '-'}</Badge>
    ),
  },
  {
    header: 'Status',
    accessor: 'isActive',
    gridSection: 'header',
    cell: (subcategory) => (
      <Badge color={subcategory.isActive ? 'success' : 'gray'}>
        {subcategory.isActive ? 'Aktif' : 'Nonaktif'}
      </Badge>
    ),
  },
  {
    header: 'Dibuat',
    accessor: 'createdAt',
    gridSection: 'footer',
    cell: (subcategory) => {
      const date = new Date(subcategory.createdAt);
      return (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      );
    },
  },
];
