import { HiOutlineBell } from "react-icons/hi";
import { Dropdown } from "flowbite-react";

export default function NotificationDropdown({ notifications, unreadCount, handleNotificationClick, loadingNotifications }) {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <div className="relative">
          <HiOutlineBell className="h-6 w-6 text-gray-700 dark:text-gray-300 cursor-pointer" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </div>
      }
    >
      <Dropdown.Header>
        <span className="text-sm font-semibold">Notifikasi</span>
      </Dropdown.Header>

      <div className="w-[320px] sm:w-[400px] max-h-96 overflow-y-auto">
        {loadingNotifications ? (
          <p className="text-center text-gray-500 py-2">Memuat notifikasi...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-2">Belum ada notifikasi</p>
        ) : (
          notifications.map((notif) => (
            <Dropdown.Item
              key={notif.id}
              className={`flex flex-col items-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${
                notif.isRead ? "opacity-60" : ""
              }`}
              onClick={() => handleNotificationClick(notif)}
            >
              <p className="text-sm font-medium line-clamp-2 break-words">{notif.link}</p>
              <p className="text-sm font-medium line-clamp-2 break-words">{notif.message}</p>
              <span className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</span>
            </Dropdown.Item>
          ))
        )}
      </div>
    </Dropdown>
  );
}
