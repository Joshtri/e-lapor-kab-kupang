'use client';

import { useEffect, useState } from 'react';
import { Spinner, Button } from 'flowbite-react';
import { toast } from 'sonner';
import {
  HiOutlinePlus,
  HiOutlineViewList,
  HiOutlineViewGrid,
} from 'react-icons/hi';
import PageHeader from '@/components/ui/page-header';
import ReportFilterBar from '@/components/admin/report/ReportFilterBar';
import BugTableView from './BugTableView';
import BugGridView from './BugGridView';
import BugCommentCreateModal from './BugCommentCreateModal';
import EmptyState from '@/components/ui/empty-state';
import Pagination from '@/components/ui/Pagination';
import BugStatusEditModal from '@/components/admin/bugs/BugStatusEditModal';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
export default function BugReportList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedBugId, setSelectedBugId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('ALL');

  // const { formatted, relative } = formatDate(bug.createdAt);
  const [selectedBug, setSelectedBug] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const pageSize = 8;

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        ...(filterStatus !== 'ALL' && { status: filterStatus }),
        ...(filterPriority !== 'ALL' && { priority: filterPriority }),
      });

      const res = await fetch(`/api/bugs?${params}`);
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
    const searchMatch = bug.title
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
    setCurrentPage(1);
  };

  const openCommentModal = (bugId) => {
    setSelectedBugId(bugId);
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedBugId(null);
  };

  const openEditModal = (bug) => {
    setSelectedBug(bug);
    setEditModalOpen(true);
  };

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      <PageHeader
        title="Manajemen Bug Report"
        showBackButton={false}
        showSearch
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onRefreshClick={fetchBugs}
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {
            adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
          },
        }}
      />

      <div className="flex justify-between items-center mb-6">
        <ReportFilterBar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* <Link href="/adm/bugs/create">
          <Button color="red" className="flex items-center gap-2">
            <HiOutlinePlus className="h-5 w-5" />
            Tambah Bug Report
          </Button>
        </Link> */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : filteredBugs.length === 0 ? (
        <EmptyState message="Tidak ada laporan bug ...">
          <p className="text-sm">Coba ubah filter atau cari kata kunci lain.</p>
          <Button color="gray" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </EmptyState>
      ) : (
        <>
          {viewMode === 'table' ? (
            <BugTableView
              bugs={paginatedBugs}
              formatDate={formatDate}
              openCommentModal={openCommentModal}
              openEditModal={openEditModal} // ✅ tambahkan ini
            />
          ) : (
            <BugGridView
              bugs={paginatedBugs}
              formatDate={formatDate}
              openCommentModal={openCommentModal}
              openEditModal={openEditModal} // ✅ tambahkan ini
            />
          )}

          <Pagination
            totalItems={filteredBugs.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <BugCommentCreateModal
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        bugId={selectedBugId}
      />

      <BugStatusEditModal
        open={editModalOpen} // ✅ pakai state boolean, bukan function
        onClose={() => setEditModalOpen(false)}
        bug={selectedBug}
        onSave={fetchBugs} // refetch
      />
    </div>
  );
}
