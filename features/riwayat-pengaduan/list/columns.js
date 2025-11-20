import TruncatedWithTooltip from '@/components/ui/TruncatedWithTooltip';
import StatusBadge from '@/components/common/StatusBadge';

export const getColumns = () => [
  {
    header: 'Subjek',
    accessor: 'title',
    width: 'w-2/5',
    cell: (r) => <TruncatedWithTooltip text={r.title} length={50} />,
  },
  {
    header: 'Status',
    accessor: 'bupatiStatus',
    width: 'w-1/5',
    cell: (r) => <StatusBadge bupati={r.bupatiStatus} />,
  },
  {
    header: 'Kategori',
    accessor: 'category',
    width: 'w-1/6',
    cell: (r) => (
      <TruncatedWithTooltip text={r.category || '-'} length={20} />
    ),
  },
  {
    header: 'Tanggal',
    accessor: 'createdAt',
    width: 'w-1/5',
    cell: (r) => new Date(r.createdAt).toLocaleDateString('id-ID'),
  },
];
