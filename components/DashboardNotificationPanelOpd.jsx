'use client';

import ChangeOpdModal from '@/components/ChangeOpdModal'; // sesuaikan path
import LoadingMail from '@/components/ui/loading/LoadingMail';
import { formatDate, getStatusColor } from '@/utils/common';
import { Badge, Button, Card, Tooltip } from 'flowbite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineEyeOff,
  HiOutlinePencil,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';

export default function DashboardNotificationPanelOpd() {
  const [openIndex, setOpenIndex] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports/opd-notif-dashboard');
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        'Gagal memuat notifikasi laporan OPD:', err;
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 shadow-sm">
        <div className="flex items-center mb-2">
          <HiOutlineSpeakerphone className="text-blue-600 dark:text-blue-400 w-5 h-5 mr-2" />
          <h2 className="text-md font-semibold text-blue-800 dark:text-blue-300">
            Notifikasi Laporan Terbaru
          </h2>
        </div>

        {loading ? (
          <LoadingMail />
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Tidak ada notifikasi baru
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto pr-1">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((item, index) => {
                const isOpen = openIndex === index;
                const isUnread = !item.isReadByOpd;

                return (
                  <motion.li
                    key={item.id}
                    className={`relative py-3 ${isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400" />
                    )}

                    <div className="px-4">
                      <div className="flex justify-between items-start gap-2">
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="flex-1 text-left"
                        >
                          <h4
                            className={`text-sm font-medium ${isUnread ? 'text-blue-700 dark:text-blue-300 font-semibold' : 'text-gray-800 dark:text-white'}`}
                          >
                            {item.title}
                          </h4>

                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Dituju ke OPD: {item.opd?.name}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              color={getStatusColor(item.bupatiStatus)}
                              size="xs"
                            >
                              Bupati: {item.bupatiStatus}
                            </Badge>
                            <Badge
                              color={getStatusColor(item.opdStatus)}
                              size="xs"
                            >
                              OPD: {item.opdStatus}
                            </Badge>
                          </div>
                        </button>

                        <button
                          onClick={() => toggleAccordion(index)}
                          className="text-gray-600 dark:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                          {isOpen ? (
                            <HiOutlineChevronUp className="h-4 w-4" />
                          ) : (
                            <HiOutlineChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        <Button
                          color="blue"
                          size="xs"
                          pill
                          className="mt-2"
                          onClick={() => {
                            setSelectedReportId(item.id);
                            setShowModal(true);
                          }}
                        >
                          <HiOutlinePencil className="w-4 h-4 mr-1" />
                          Ubah OPD
                        </Button>
                      </div>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 overflow-hidden"
                          >
                            <div className="space-y-3 text-sm">
                              <p className="text-gray-600 dark:text-gray-300">
                                {item.description}
                              </p>

                              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                                <div>Kategori: {item.category}</div>
                                <div>Subkategori: {item.subcategory}</div>
                                <div>Prioritas: {item.priority}</div>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <div>
                                    Dibuat: {formatDate(item.createdAt)}
                                  </div>
                                  <div>
                                    Diperbarui: {formatDate(item.updatedAt)}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Tooltip
                                    content={`Bupati ${item.isReadByBupati ? 'sudah' : 'belum'} membaca`}
                                  >
                                    <div className="flex items-center gap-1">
                                      {item.isReadByBupati ? (
                                        <HiOutlineCheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <HiOutlineEyeOff className="h-4 w-4 text-amber-500" />
                                      )}
                                      <span className="text-xs">Bupati</span>
                                    </div>
                                  </Tooltip>

                                  <Tooltip
                                    content={`OPD ${item.isReadByOpd ? 'sudah' : 'belum'} membaca`}
                                  >
                                    <div className="flex items-center gap-1">
                                      {item.isReadByOpd ? (
                                        <HiOutlineCheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <HiOutlineEyeOff className="h-4 w-4 text-amber-500" />
                                      )}
                                      <span className="text-xs">OPD</span>
                                    </div>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        )}

        <ChangeOpdModal
          show={showModal}
          reportId={selectedReportId}
          currentOpdId={
            notifications.find((r) => r.id === selectedReportId)?.opd?.id ||
            null
          }
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            // Optional: lakukan fetch ulang data notifikasi agar terlihat perubahan OPD-nya
          }}
        />
      </Card>
    </motion.div>
  );
}
