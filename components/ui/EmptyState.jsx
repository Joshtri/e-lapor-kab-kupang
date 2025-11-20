import PropTypes from 'prop-types';
import { HiOutlineInbox } from 'react-icons/hi';
import Heading from './Heading';
import Text from './Text';
// import Heading from './Heading';
// import Text from './Text';

export default function EmptyState({
  message = 'Data tidak ditemukan',
  description = 'Tidak ada data untuk ditampilkan saat ini.',
  icon: Icon = HiOutlineInbox,
  children,
  className = '',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white via-blue-50 to-blue-100/40 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/20 p-8 shadow-sm text-center flex flex-col items-center gap-4 ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-100/40 dark:bg-blue-900/20 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full bg-indigo-100/40 dark:bg-indigo-900/20 blur-2xl" />
      </div>
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/80 dark:bg-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-600 shadow-inner">
        <Icon className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-pulse" />
      </div>
      <Heading className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
        {message}
      </Heading>
      {description && (
        <Text className="max-w-md text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </Text>
      )}
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
};
