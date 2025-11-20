'use client';

import { Badge, Button, Avatar } from 'flowbite-react';
import {
  HiOutlineEye,
  HiOutlineChatAlt2,
  HiOutlinePencilAlt,
} from 'react-icons/hi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GenericGridView from '@/components/ui/GenericGridView';
import UpdateStatusModal from '@/components/bupati/UpdateStatusPelapor';
import CommentModal from '@/components/bupati/comment/comment-modal';

export default function ReportGrid({ reports }) {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const renderReportCard = (report) => (
    <>
      <div className="flex items-center gap-3">
        <Avatar
          placeholderInitials={report?.user.name?.charAt(0) || 'A'}
          // img={`https://ui-avatars.com/api/?name=${report.user?.name}&background=random`}
          rounded
          size="sm"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {report.user?.name || 'Anonim'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(report.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
        {report.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {report.category}
      </p>

      <div className="flex gap-2 mt-3">
        <Badge
          color={
            report.status === 'SELESAI'
              ? 'green'
              : report.status === 'PROSES'
                ? 'yellow'
                : report.status === 'DITOLAK'
                  ? 'red'
                  : 'gray'
          }
          className="text-xs font-semibold px-3 py-1"
        >
          {report.status}
        </Badge>
        <Badge color="blue" className="text-xs font-semibold px-3 py-1">
          {report.priority}
        </Badge>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          color="gray"
          size="sm"
          onClick={() =>
            router.push(`/bupati-portal/kelola-pengaduan/${report.id}`)
          }
        >
          <HiOutlineEye className="w-4 h-4 mr-1" />
          Detail
        </Button>
        <Button
          color="purple"
          size="sm"
          onClick={() => {
            setSelectedReport(report);
            setOpenCommentModal(true);
          }}
        >
          <HiOutlineChatAlt2 className="w-4 h-4 mr-1" />
          Komentar
        </Button>
        <Button
          color="blue"
          size="sm"
          onClick={() => {
            setSelectedReport(report);
            setOpenStatusModal(true);
          }}
        >
          <HiOutlinePencilAlt className="w-4 h-4 mr-1" />
          Ubah Status
        </Button>
      </div>
    </>
  );

  return (
    <GenericGridView
      data={reports}
      renderItem={renderReportCard}
      modals={
        <>
          {selectedReport && (
            <UpdateStatusModal
              open={openStatusModal}
              setOpen={setOpenStatusModal}
              report={selectedReport}
            />
          )}
          {selectedReport && (
            <CommentModal
              open={openCommentModal}
              setOpen={setOpenCommentModal}
              reportId={selectedReport.id}
            />
          )}
        </>
      }
    />
  );
}
