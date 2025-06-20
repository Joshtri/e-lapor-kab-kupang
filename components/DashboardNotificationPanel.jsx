'use client';

import ChangeOpdModal from '@/components/ChangeOpdModal'; // path sesuai strukturmu
import { getStatusColor } from '@/utils/statusColor';
import { format } from 'date-fns';
import { Badge, Button, Card, Tooltip } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineCheckCircle,
  HiOutlineEyeOff,
  HiOutlinePencil,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';
import LoadingMail from './ui/loading/LoadingMail';

const DashboardNotificationPanel = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatDate = (dateStr) =>
    format(new Date(dateStr), 'dd MMM yyyy, HH:mm');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports/notif-dashboard');
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        'Gagal memuat notifikasi laporan:', err;
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <Card className="w-full mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
      <div className="flex items-center mb-2">
        <HiOutlineSpeakerphone className="text-blue-600 dark:text-blue-400 w-5 h-5 mr-2" />
        <h2 className="text-md font-semibold text-blue-800 dark:text-blue-300">
          Notifikasi Laporan Terbaru
        </h2>
      </div>

      {loading ? (
          <LoadingMail />
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-1">
          {/* 👆 Bisa atur max-h sesuai tinggi yang diinginkan */}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <li key={item.id} className="py-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="flex-1 text-left"
                    >
                      <p className="font-medium truncate text-sm">
                        {item.title}
                      </p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge
                          color={getStatusColor(item.bupatiStatus)}
                          size="xs"
                        >
                          Bupati: {item.bupatiStatus}
                        </Badge>
                        <Badge color={getStatusColor(item.opdStatus)} size="xs">
                          OPD: {item.opdStatus}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Dibuat: {formatDate(item.createdAt)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Diperbarui: {formatDate(item.updatedAt)}
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        color="blue"
                        size="xs"
                        pill
                        className="flex items-center gap-1"
                        onClick={() => {
                          setSelectedReportId(item.id);
                          setShowModal(true);
                        }}
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                        Ubah OPD
                      </Button>
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="text-gray-600 dark:text-gray-300"
                      >
                        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
                      </button>
                    </div>
                  </div>

                  <ChangeOpdModal
                    show={showModal}
                    reportId={selectedReportId}
                    currentOpdId={
                      notifications.find((r) => r.id === selectedReportId)?.opd
                        ?.id || null
                    }
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                      setShowModal(false);
                      // Optionally refetch data
                    }}
                  />

                  {isOpen && (
                    <div className="mt-3 text-sm text-gray-800 dark:text-gray-200 space-y-2">
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Kategori: {item.category} · Subkategori:{' '}
                        {item.subcategory}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Prioritas: {item.priority}
                      </p>
                      <div className="flex gap-2 items-center">
                        <Tooltip
                          content={`Bupati ${item.isReadByBupati ? 'sudah' : 'belum'} membaca`}
                        >
                          {item.isReadByBupati ? (
                            <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <HiOutlineEyeOff className="w-4 h-4 text-yellow-400" />
                          )}
                        </Tooltip>
                        <Tooltip
                          content={`OPD ${item.isReadByOpd ? 'sudah' : 'belum'} membaca`}
                        >
                          {item.isReadByOpd ? (
                            <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <HiOutlineEyeOff className="w-4 h-4 text-yellow-400" />
                          )}
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default DashboardNotificationPanel;
