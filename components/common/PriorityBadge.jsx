'use client';

import {
  HiExclamationCircle,
  HiOutlineExclamation,
  HiCheckCircle,
} from 'react-icons/hi';

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-300',
          icon: HiExclamationCircle,
          label: 'Tinggi',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-300',
          icon: HiOutlineExclamation,
          label: 'Sedang',
        };
      case 'LOW':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-700 dark:text-green-300',
          icon: HiCheckCircle,
          label: 'Rendah',
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-900/20',
          border: 'border-slate-200 dark:border-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          icon: HiOutlineExclamation,
          label: 'Normal',
        };
    }
  };

  const config = getPriorityConfig(priority);
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${config.bg} ${config.border} ${config.text} text-xs font-semibold transition-all duration-200`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
};

export default PriorityBadge;