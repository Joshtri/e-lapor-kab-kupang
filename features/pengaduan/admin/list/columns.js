import InlineOPDSelector from '@/components/admin/report/InlineOPDSelector';
import PriorityBadge from '@/components/common/PriorityBadge';
import StatusBadge from '@/components/common/StatusBadge';
import { truncateText } from '@/utils/common';

export const getColumns = (refetchReports) => [
  {
    header: 'Subjek',
    accessor: 'title',
    gridSection: 'header',
    gridHighlight: true,
    cell: (r) => truncateText(r.title, 45),
    gridBadge: {
      show: (r) => !r.isReadByBupati,
      text: 'Baru',
      colorClass:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    },
  },

  {
    header: 'Kategori',
    accessor: 'category',
    gridSection: 'header',
    cell: (r) => truncateText(r.category, 20),
  },
  {
    header: 'Pelapor',
    accessor: 'user.name',
    gridSection: 'header',
    cell: (r) => r.user?.name || 'Anonim',
  },

  {
    header: 'OPD',
    accessor: 'opd.name',
    gridSection: 'header',
    cell: (r) => (
      <div className="truncate max-w-xs">
        <InlineOPDSelector report={r} onUpdated={refetchReports} />
      </div>
    ),
  },
  {
    header: 'Prioritas',
    accessor: 'priority',
    gridSection: 'header',
    cell: (r) => <PriorityBadge priority={r.priority} />,
  },
  {
    header: 'Status',
    accessor: 'bupatiStatus',
    gridSection: 'header',
    cell: (r) => <StatusBadge bupati={r.bupatiStatus} opd={r.opdStatus} />,
  },
  {
    header: 'Tanggal',
    accessor: 'createdAt',
    gridSection: 'footer',
    cell: (r) =>
      new Date(r.createdAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  },
];
