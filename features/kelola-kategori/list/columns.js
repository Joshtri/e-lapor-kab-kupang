import { Badge, Button, Tooltip } from 'flowbite-react';
import { HiTag, HiChevronDown, HiPencil, HiTrash } from 'react-icons/hi';

export const getColumns = (handlers = {}) => [
  {
    header: 'Kategori',
    accessor: 'name',
    gridSection: 'header',
    gridHighlight: true,
    cell: (category) => (
      <div className="flex items-center gap-2">
        <HiTag className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <span className="font-medium text-gray-900 dark:text-white">
          {category.name}
        </span>
      </div>
    ),
  },
  {
    header: 'Subkategori',
    accessor: 'subcategories',
    gridSection: 'header',
    cell: (category) => {
      const subcategories = category.subcategories || [];
      const activeCount = subcategories.filter(sub => sub.isActive).length;

      if (subcategories.length === 0) {
        return (
          <Badge color="gray" className="inline-flex">
            Belum ada subkategori
          </Badge>
        );
      }

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge color="info">
              {subcategories.length} total
            </Badge>
            <Badge color="success">
              {activeCount} aktif
            </Badge>
          </div>
          <details className="group">
            <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1">
              <HiChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
              Lihat daftar
            </summary>
            <div className="mt-2 pl-4 border-l-2 border-blue-200 dark:border-blue-700 space-y-1.5">
              {subcategories.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{sub.name}</span>
                    <Badge size="xs" color={sub.isActive ? 'success' : 'gray'}>
                      {sub.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip content="Edit subkategori">
                      <Button
                        size="xs"
                        color="warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlers.onEditSubcategory?.(sub, category);
                        }}
                        className="!p-1"
                      >
                        <HiPencil className="h-3 w-3" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Hapus subkategori">
                      <Button
                        size="xs"
                        color="failure"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlers.onDeleteSubcategory?.(sub);
                        }}
                        className="!p-1"
                      >
                        <HiTrash className="h-3 w-3" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      );
    },
  },
  {
    header: 'Status',
    accessor: 'isActive',
    gridSection: 'header',
    cell: (category) => (
      <Badge color={category.isActive ? 'success' : 'gray'}>
        {category.isActive ? 'Aktif' : 'Nonaktif'}
      </Badge>
    ),
  },
  {
    header: 'Dibuat',
    accessor: 'createdAt',
    gridSection: 'footer',
    cell: (category) => {
      const date = new Date(category.createdAt);
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
