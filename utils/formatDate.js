// utils/formatDate.js
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format date string into readable formats.
 * @param {string|Date} dateStr - The date string or object.
 * @returns {{ formatted: string, relative: string }}
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return {
    formatted: format(date, 'dd MMM yyyy, HH:mm', { locale: id }),
    relative: formatDistanceToNow(date, { addSuffix: true, locale: id }),
  };
}
