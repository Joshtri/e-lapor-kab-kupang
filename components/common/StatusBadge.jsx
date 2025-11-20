'use client';

import {
  HiCheckCircle,
  HiExclamationCircle,
  HiXCircle,
  HiOutlineClock,
} from 'react-icons/hi';

const StatusBadge = ({ bupati = '-', opd = '-' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'DONE':
      case 'SELESAI':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-700 dark:text-emerald-300',
          icon: HiCheckCircle,
          label: 'Selesai',
        };
      case 'PROCESS':
      case 'PROSES':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-300',
          icon: HiOutlineClock,
          label: 'Proses',
        };
      case 'REJECTED':
      case 'DITOLAK':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-300',
          icon: HiXCircle,
          label: 'Ditolak',
        };
      case 'PENDING':
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-900/20',
          border: 'border-slate-200 dark:border-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          icon: HiExclamationCircle,
          label: 'Pending',
        };
    }
  };

  const renderStatus = (status, label) => {
    if (!status || status === '-') return null;
    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${config.bg} ${config.border} ${config.text} text-xs font-medium transition-all duration-200`}
      >
        <IconComponent className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {bupati && bupati !== '-' && renderStatus(bupati, 'Bupati')}
      {opd && opd !== '-' && renderStatus(opd, 'OPD')}
      {(!bupati || bupati === '-') && (!opd || opd === '-') && (
        <div className="text-xs text-gray-400">-</div>
      )}
    </div>
  );
};

export default StatusBadge;
