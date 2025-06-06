import { format } from 'date-fns';
import { id } from 'date-fns/locale';
 
export const truncateText = (text, limit = 50) => {
  if (!text) return '-';
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

export const formatDate = (dateStr) =>
  format(new Date(dateStr), 'dd MMM yyyy, HH:mm');

// Helper function to get status color
export const getStatusColor = (status) => {
  const statusMap = {
    PENDING: 'yellow',
    PROCESSING: 'blue',
    COMPLETED: 'green',
    REJECTED: 'red',
    FORWARDED: 'purple',
  };
  return statusMap[status] || 'gray';
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};




export function formatDateIndo(date, formatStr = 'dd MMM yyyy') {
  return format(new Date(date), formatStr, { locale: id });
}