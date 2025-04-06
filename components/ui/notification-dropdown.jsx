'use client';
import { Dropdown, Spinner } from 'flowbite-react';
import { HiOutlineBell, HiOutlineMailOpen } from 'react-icons/hi';
import { motion } from 'framer-motion';

const NotificationDropdown = ({
  notifications,
  unreadCount,
  handleNotificationClick,
  loadingNotifications,
}) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      className="w-96 max-w-2xl" // ✅ batas lebar dropdown
      label={
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <HiOutlineBell className="h-5 w-5" />
          </motion.button>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
            >
              {unreadCount}
            </motion.span>
          )}
        </div>
      }
    >
      <Dropdown.Header>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Notifikasi
          </span>
          {unreadCount > 0 && (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {unreadCount} baru
            </span>
          )}
        </div>
      </Dropdown.Header>
      <div className="max-h-60 overflow-y-auto">
        {loadingNotifications ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-4 px-3 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-center mb-2">
              <HiOutlineMailOpen className="h-6 w-6" />
            </div>
            <p>Tidak ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Dropdown.Item
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`border-b border-gray-100 dark:border-gray-700 ${
                !notif.isRead
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`p-2 rounded-full ${
                    !notif.isRead
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <HiOutlineMailOpen className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      !notif.isRead
                        ? 'font-semibold text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </div>
            </Dropdown.Item>
          ))
        )}
      </div>
      <Dropdown.Divider />
      <Dropdown.Item
        href="#"
        className="text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        Lihat Semua Notifikasi
      </Dropdown.Item>
    </Dropdown>
  );
};

export default NotificationDropdown;
