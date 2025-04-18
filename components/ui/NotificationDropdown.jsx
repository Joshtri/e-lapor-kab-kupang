
import { Dropdown, Spinner, Button } from 'flowbite-react';
import { HiOutlineBell, HiOutlineMailOpen } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = ({
  notifications = [],
  unreadCount = 0,
  handleNotificationClick = () => {},
  loadingNotifications = false,
}) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      trigger="hover"
      placement="bottom-end"
      className="w-80 sm:w-96 md:w-[450px] max-w-[90vw]"
      label={
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            role="button"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <HiOutlineBell className="h-5 w-5" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <div className="max-h-[80vh] overflow-hidden flex flex-col">
        <Dropdown.Header className="border-b dark:border-gray-700 p-4">
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

        <div className="max-h-[350px] overflow-y-auto">
          {loadingNotifications ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="flex justify-center mb-2">
                <HiOutlineMailOpen className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tidak ada notifikasi
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    backgroundColor: notif.isRead
                      ? 'rgba(0,0,0,0.03)'
                      : undefined,
                    transition: { duration: 0.2 },
                  }}
                  className={`cursor-pointer border-b dark:border-gray-700 last:border-b-0 ${
                    !notif.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="p-4 flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full flex items-center justify-center h-10 w-10 ${
                        !notif.isRead
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <HiOutlineMailOpen className="h-5 w-5" />
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
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
                      <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 p-3 mt-auto">
          <Button
            color="gray"
            size="xs"
            className="w-full justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Lihat Semua Notifikasi
          </Button>
        </div>
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;
