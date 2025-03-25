import { HiOutlineInbox } from "react-icons/hi";

export default function EmptyState({ message = "Data tidak ditemukan", children }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400 space-y-4">
      <HiOutlineInbox className="w-16 h-16 text-gray-400 dark:text-gray-500" />
      <h3 className="text-lg font-semibold">{message}</h3>
      {children}
    </div>
  );
}
