import { Badge, Tooltip, Button } from 'flowbite-react';
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineChatAlt2,
  HiCheckCircle,
  HiOutlineClock,
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export const statusKey = 'bupatiStatus';
export const priorityKey = 'priority';

export const searchFields = [
  'title',
  'description',
  'category',
  'priority',
  'bupatiStatus',
  'user.name',
  'opd.name',
];

export const renderItem = (item) => (
  <div
    key={item.id}
    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
  >
    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
      {item.title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
      {item.description}
    </p>
    <p className="text-xs mt-2 text-gray-400">
      Tanggal: {new Date(item.createdAt).toLocaleDateString('id-ID')}
    </p>
  </div>
);

export const columns = [
  {
    key: 'user',
    header: 'Nama Pelapor',
    render: (_, row) => row.user?.name || 'Anonim',
  },
  {
    key: 'title',
    header: 'Subjek',
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <span className="truncate max-w-[180px]">{row.title}</span>
        {!row.isReadByBupati ? (
          <Tooltip content="Belum dibaca">
            <HiOutlineClock className="text-yellow-500 w-4 h-4" />
          </Tooltip>
        ) : (
          <Tooltip content="Sudah dibaca">
            <HiCheckCircle className="text-green-500 w-4 h-4" />
          </Tooltip>
        )}
      </div>
    ),
  },
  { key: 'category', header: 'Kategori' },
  {
    key: 'bupatiStatus',
    header: 'Status Bupati',
    render: (val) => (
      <Badge
        color={
          val === 'SELESAI'
            ? 'green'
            : val === 'PROSES'
              ? 'yellow'
              : val === 'DITOLAK'
                ? 'red'
                : 'gray'
        }
      >
        {val}
      </Badge>
    ),
  },
  {
    key: 'priority',
    header: 'Prioritas',
    render: (val) => <Badge color="blue">{val}</Badge>,
  },
  {
    key: 'createdAt',
    header: 'Tanggal',
    render: (val) => new Date(val).toLocaleDateString('id-ID'),
  },
];

export const actions = [
  {
    Component: ({ row }) => {
      const router = useRouter();
      return (
        <Tooltip content="Lihat Detail">
          <Button
            color="gray"
            size="xs"
            onClick={() =>
              router.push(`/bupati-portal/laporan-warga/${row.id}`)
            }
            className="p-2"
          >
            <HiOutlineEye className="w-4 h-4" />
          </Button>
        </Tooltip>
      );
    },
  },
  {
    Component: ({ row }) => (
      <Tooltip content="Komentar">
        <Button
          color="purple"
          size="xs"
          onClick={() => {
            if (typeof window.openCommentModal === 'function') {
              window.openCommentModal(row);
            }
          }}
          className="p-2"
        >
          <HiOutlineChatAlt2 className="w-4 h-4" />
        </Button>
      </Tooltip>
    ),
  },
  {
    Component: ({ row }) => (
      <Tooltip content="Ubah Status">
        <Button
          color="blue"
          size="xs"
          onClick={() => {
            if (typeof window.openStatusModal === 'function') {
              window.openStatusModal(row);
            }
          }}
          className="p-2"
        >
          <HiOutlinePencilAlt className="w-4 h-4" />
        </Button>
      </Tooltip>
    ),
  },
];

export const rowClassName = (row) =>
  !row.isReadByBupati
    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400'
    : '';

const reports = {
  statusKey,
  priorityKey,
  searchFields,
  columns,
  actions,
  rowClassName,
  renderItem,
};

export default reports;
