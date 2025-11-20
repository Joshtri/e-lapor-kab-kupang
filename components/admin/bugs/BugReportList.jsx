'use client';

import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  HiOutlineChatAlt2,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiCheckCircle,
  HiOutlineClock,
} from 'react-icons/hi';
import { Badge } from 'flowbite-react'; // ⬅️ tambahkan ini di atas

import ListGrid from '@/components/ui/datatable/ListGrid';
// import GridDataList from '@/components/ui/datatable/GridDataList';
// import DataCard from '@/components/ui/datatable/_DataCard';
import { getStatusColor } from '@/utils/statusColor';
import { truncateText } from '@/utils/common';
import BugStatusEditModal from './BugStatusEditModal';
import BugCommentCreateModal from './BugCommentCreateModal';
import ActionsButton from '@/components/ui/ActionsButton';

export default function BugReportList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [selectedBug, setSelectedBug] = useState(null);
  const [selectedBugId, setSelectedBugId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const pageSize = 8;

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bugs');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBugs(data);
    } catch (err) {
      toast.error('Gagal memuat laporan bug');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const filteredBugs = bugs.filter((bug) => {
    const statusMatch =
      filterStatus === 'ALL' || bug.statusProblem === filterStatus;
    const priorityMatch =
      filterPriority === 'ALL' || bug.priorityProblem === filterPriority;
    const searchMatch = [bug.title, bug.description]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

  const paginatedBugs = filteredBugs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleResetFilter = () => {
    setFilterStatus('ALL');
    setFilterPriority('ALL');
    setSearchQuery('');
  };

  const columns = [
    {
      header: 'Judul',
      accessor: 'title',
      cell: (bug) => (
        <div className="flex items-center gap-2 max-w-[240px] truncate">
          <span title={bug.title}>{truncateText(bug.title, 40)}</span>
          {!bug.isReadByAdmin ? (
            <HiOutlineClock className="text-yellow-500 w-4 h-4" />
          ) : (
            <HiCheckCircle className="text-green-500 w-4 h-4" />
          )}
        </div>
      ),
    },
    {
      header: 'Pelapor',
      accessor: 'user.name',
      cell: (bug) => bug.user?.name || 'Anonim',
    },
    {
      header: 'Status',
      accessor: 'statusProblem',
      cell: (bug) => (
        <Badge color={getStatusColor(bug.statusProblem)}>
          {bug.statusProblem}
        </Badge>
      ),
    },
    {
      header: 'Prioritas',
      accessor: 'priorityProblem',
      cell: (bug) => (
        <Badge color={getStatusColor(bug.priorityProblem)}>
          {bug.priorityProblem}
        </Badge>
      ),
    },
    {
      header: 'Tanggal',
      accessor: 'createdAt',
      cell: (bug) => new Date(bug.createdAt).toLocaleDateString('id-ID'),
    },
  ];

  const actionButtons = [
    (bug) => (
      <ActionsButton
        icon={HiOutlineEye}
        tooltip="Lihat Detail"
        href={`/adm/bugs/${bug.id}`}
        color="gray"
      />
    ),
    (bug) => (
      <ActionsButton
        icon={HiOutlineChatAlt2}
        tooltip="Komentar"
        color="blue"
        onClick={() => {
          setSelectedBugId(bug.id);
          setCommentModalOpen(true);
        }}
      />
    ),
    (bug) => (
      <ActionsButton
        icon={HiOutlinePencilAlt}
        tooltip="Ubah Status"
        color="dark"
        onClick={() => {
          setSelectedBug(bug);
          setEditModalOpen(true);
        }}
      />
    ),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-6"
    >
      <ListGrid
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {},
        }}
        data={paginatedBugs}
        loading={loading}
        title="Laporan Bug"
        searchBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1); // reset ke halaman awal saat cari
        }}
        showSearch={true}
        showBackButton={false}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={columns}
        actionButtons={actionButtons}
        rowClassName={(bug) =>
          !bug.isReadByAdmin
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
        paginationProps={{
          totalItems: filteredBugs.length,
          currentPage,
          pageSize,
          onPageChange: setCurrentPage,
        }}
        filtersComponent={
          <div className="space-y-3">
            <select
              className="w-full p-2 border rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              className="w-full p-2 border rounded"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <Button
              color="gray"
              onClick={() => {
                setFilterStatus('ALL');
                setFilterPriority('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
            >
              Reset Filter
            </Button>
          </div>
        }
        emptyMessage="Tidak ada bug ditemukan"
        emptyAction={
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        }
      />

      <BugCommentCreateModal
        isOpen={commentModalOpen}
        bugId={selectedBugId}
        onClose={() => setCommentModalOpen(false)}
      />

      <BugStatusEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        bug={selectedBug}
        onSave={fetchBugs}
      />
    </motion.div>
  );
}
