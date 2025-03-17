import { HiOutlineBell } from "react-icons/hi";
import { Dropdown } from "flowbite-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import idLocale from "date-fns/locale/id"; // Locale untuk bahasa Indonesia

export default function NotificationDropdown({ notifications, unreadCount, handleNotificationClick, loadingNotifications }) {
  
  // ✅ Fungsi untuk memformat waktu (Hari Ini, Kemarin, atau Tanggal Lengkap)
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Hari Ini";
    } else if (isYesterday(date)) {
      return "Kemarin";
    } else {
      return format(date, "dd MMM yyyy", { locale: idLocale });
    }
  };

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
          // ✅ Kelompokkan notifikasi berdasarkan tanggal
          Object.entries(
            notifications.reduce((acc, notif) => {
              const dateKey = formatDate(notif.createdAt);
              if (!acc[dateKey]) acc[dateKey] = [];
              acc[dateKey].push(notif);
              return acc;
            }, {})
          ).map(([date, group]) => (
            <div key={date}>
              <div className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-300">
                {date}
              </div>
              {group.map((notif) => (
                <Dropdown.Item
                  key={notif.id}
                  className={`flex flex-col items-start px-4 py-3 transition-all ${
                    notif.isRead
                      ? "bg-gray-100 dark:bg-gray-700 opacity-70" // 🔴 Notifikasi sudah dibaca (pudar)
                      : "bg-white dark:bg-gray-800 font-bold" // 🟢 Notifikasi belum dibaca (lebih terang)
                  } hover:bg-gray-200 dark:hover:bg-gray-600`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <p className="text-sm break-words">{notif.message}</p>
                  <span className="text-xs text-gray-500">{format(parseISO(notif.createdAt), "HH:mm", { locale: idLocale })}</span>
                </Dropdown.Item>
              ))}
            </div>
          ))
        )}
      </div>
    </Dropdown>
  );
}
