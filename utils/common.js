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

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'red';
    case 'MEDIUM':
      return 'yellow';
    case 'LOW':
      return 'blue';
    default:
      return 'blue';
  }
};

export function formatDateIndo(date, formatStr = 'dd MMM yyyy') {
  return format(new Date(date), formatStr, { locale: id });
}


export async function convertFileToBuffer(file) {
  if (!file || typeof file.arrayBuffer !== 'function') return null;
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function validateImageFile(file) {
  if (!file) return { valid: true };

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File bukan gambar.' };
  }

  if (file.size > 5_000_000) {
    return { valid: false, error: 'Ukuran gambar terlalu besar.' };
  }

  return { valid: true };
}