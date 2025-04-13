'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spinner, Card, Badge } from 'flowbite-react';
import {
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
} from 'react-icons/hi';
import { toast } from 'sonner';
import PageHeader from '@/components/ui/page-header';
import { formatDate } from '@/utils/formatDate';
import BugCommentThread from '@/components/admin/bugs/BugComments'; // optional

export default function BugDetailPage() {
  const { id } = useParams();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const res = await fetch(`/api/bugs/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBug(data);
      } catch (err) {
        toast.error('Gagal memuat data bug');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBug();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!bug) {
    return (
      <p className="text-center text-gray-500">Data bug tidak ditemukan.</p>
    );
  }

  const dateInfo = bug.createdAt
    ? formatDate(bug.createdAt)
    : { formatted: '-', relative: '-' };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <PageHeader
        title="Detail Bug Report"
        backHref="/adm/bugs"
        breadcrumbsProps={{
          home: { label: 'Beranda', href: '/adm/dashboard' },
          customRoutes: {
            adm: { label: 'Dashboard Admin', href: '/adm/dashboard' },
            bugs: { label: 'Bug Reports', href: '/adm/bugs' },
          },
        }}
      />

      <Card className="border-l-4 border-red-500 shadow-md">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {bug.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{bug.description}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Badge color="gray" icon={HiOutlineUser}>
              {bug.user?.name || 'Unknown'}
            </Badge>
            <Badge color="blue" icon={HiOutlineCalendar}>
              {dateInfo.formatted} ({dateInfo.relative})
            </Badge>
            <Badge
              color={getPriorityColor(bug.priorityProblem)}
              icon={HiOutlineLightningBolt}
            >
              Prioritas: {bug.priorityProblem}
            </Badge>
            <Badge
              color={getStatusColor(bug.statusProblem)}
              icon={HiOutlineExclamationCircle}
            >
              Status: {bug.statusProblem}
            </Badge>
          </div>

          {bug.image && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 dark:text-white mb-2">
                Lampiran
              </h3>
              <img
                src={bug.image}
                alt="Attachment"
                className="max-w-md border rounded shadow"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Optional: Thread komentar */}
      <BugCommentThread bugId={bug.id} />
    </div>
  );
}

function getPriorityColor(priority) {
  return { LOW: 'blue', MEDIUM: 'yellow', HIGH: 'red' }[priority] || 'gray';
}

function getStatusColor(status) {
  return (
    { OPEN: 'red', IN_PROGRESS: 'yellow', RESOLVED: 'green' }[status] || 'gray'
  );
}
