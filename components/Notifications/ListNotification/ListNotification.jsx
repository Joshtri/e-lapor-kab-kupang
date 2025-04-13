'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Badge,
  Button,
  Card,
  Spinner,
  Pagination,
  TextInput,
  Select,
} from 'flowbite-react';
import {
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineExclamation,
  HiOutlineInbox,
  HiOutlineFilter,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { getRoleStyles } from '@/utils/roleStyles';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRead, setFilterRead] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  const itemsPerPage = 10;

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      });

      if (filterRead !== 'all')
        queryParams.append('isRead', filterRead === 'read');
      if (filterRole !== 'all') queryParams.append('role', filterRole);

      const response = await fetch(`/api/notifications/list?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      setNotifications(data.notifications || data);
      const totalItems = data.pagination?.total || data.length;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterRead, filterRole, searchQuery]);

  useEffect(() => {
    setMounted(true);
    // Only fetch on mount, subsequent fetches will be triggered by dependency changes
    if (!mounted) {
      fetchNotifications();
    }
  }, [fetchNotifications, mounted]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/mark-read/${id}`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed');
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      toast.success('Ditandai sebagai dibaca');
    } catch {
      toast.error('Gagal menandai');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  if (!mounted || (loading && notifications.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-500 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <HiOutlineBell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Daftar Notifikasi
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Lihat dan kelola semua notifikasi
            </p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <TextInput
                type="text"
                placeholder="Cari notifikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              <Button
                type="submit"
                color="blue"
                className="absolute right-0 top-0 bottom-0 rounded-l-none"
              >
                Cari
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1">
              <HiOutlineFilter className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Filter:
              </span>
            </div>

            <Select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="w-auto"
            >
              <option value="all">Semua Status</option>
              <option value="read">Telah Dibaca</option>
              <option value="unread">Belum Dibaca</option>
            </Select>

            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-auto"
            >
              <option value="all">Semua Pengirim</option>
              <option value="ADMIN">Admin</option>
              <option value="BUPATI">Bupati</option>
              <option value="OPD">OPD</option>
              <option value="PELAPOR">Pelapor</option>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button
                color={viewMode === 'list' ? 'blue' : 'gray'}
                onClick={() => setViewMode('list')}
              >
                <HiOutlineViewList className="mr-2 h-5 w-5" />
                List
              </Button>
              <Button
                color={viewMode === 'grid' ? 'blue' : 'gray'}
                onClick={() => setViewMode('grid')}
              >
                <HiOutlineViewGrid className="mr-2 h-5 w-5" />
                Grid
              </Button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="w-16">Status</Table.HeadCell>
              <Table.HeadCell>Pesan</Table.HeadCell>
              <Table.HeadCell>Pengirim</Table.HeadCell>
              <Table.HeadCell>Tanggal</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {notifications.map((notification) => {
                const dateInfo = formatDate(notification.createdAt);
                const roleStyles = getRoleStyles(notification.user?.role);

                return (
                  <Table.Row
                    key={notification.id}
                    className={`${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <Table.Cell>
                      <div className="flex justify-center">
                        {notification.isRead ? (
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                            <HiOutlineInbox className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        ) : (
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <HiOutlineInbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell
                      className={`font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <div>
                        <p>{notification.message}</p>
                        {/* {notification.link && (
                          <Link
                            href={notification.link.replace(
                              '[id]',
                              notification.id,
                            )}
                            className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1 inline-block"
                          >
                            Lihat Detail
                          </Link>
                        )} */}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {notification.user?.name || 'System'}
                        </span>
                        <Badge color={roleStyles.badgeColor}>
                          {notification.user?.role || 'SYSTEM'}
                        </Badge>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span>{dateInfo.formatted}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {dateInfo.relative}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            color="success"
                            size="xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <HiOutlineCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {notification.link && (
                          <Link
                            href={notification.link.replace(
                              '[id]',
                              notification.id,
                            )}
                          >
                            <Button color="light" size="xs">
                              <HiOutlineEye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>

          {notifications.length === 0 && (
            <div className="p-8 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-block mb-4">
                <HiOutlineBell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Tidak ada notifikasi
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Anda belum memiliki notifikasi atau tidak ada notifikasi yang
                cocok dengan filter Anda.
              </p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notification) => {
            const dateInfo = formatDate(notification.createdAt);
            const roleStyles = getRoleStyles(notification.user?.role);

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`border-t-4 ${!notification.isRead ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {notification.isRead ? (
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                          <HiOutlineInbox className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      ) : (
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <HiOutlineInbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <Badge color={notification.isRead ? 'gray' : 'blue'}>
                        {notification.isRead ? 'Telah Dibaca' : 'Belum Dibaca'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dateInfo.formatted}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dateInfo.relative}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p
                      className={`text-lg font-bold tracking-tight ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {notification.message}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <div className={`p-2 rounded-full ${roleStyles.bgColor}`}>
                        <HiOutlineExclamation
                          className={`h-4 w-4 ${roleStyles.textColor}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notification.user?.name || 'System'}
                        </p>
                        <Badge color={roleStyles.badgeColor}>
                          {notification.user?.role || 'SYSTEM'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!notification.isRead && (
                      <Button
                        color="success"
                        onClick={() => markAsRead(notification.id)}
                        className="flex-1"
                      >
                        <HiOutlineCheck className="mr-2 h-5 w-5" />
                        Tandai Dibaca
                      </Button>
                    )}
                    {notification.link && (
                      <Link
                        href={notification.link.replace(
                          '[id]',
                          notification.id,
                        )}
                        className="flex-1"
                      >
                        <Button color="light" className="w-full">
                          <HiOutlineEye className="mr-2 h-5 w-5" />
                          Lihat Detail
                        </Button>
                      </Link>
                    )}
                    <Button
                      color="failure"
                      onClick={() => deleteNotification(notification.id)}
                      className="flex-1"
                    >
                      <HiOutlineTrash className="mr-2 h-5 w-5" />
                      Hapus
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {notifications.length === 0 && (
            <div className="col-span-full">
              <Card className="p-8 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-block mb-4">
                  <HiOutlineBell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Tidak ada notifikasi
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Anda belum memiliki notifikasi atau tidak ada notifikasi yang
                  cocok dengan filter Anda.
                </p>
              </Card>
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}
    </div>
  );
}
