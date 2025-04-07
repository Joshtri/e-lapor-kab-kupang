import { clsx } from 'clsx';

/**
 * Combines class names conditionally
 * @param  {...any} inputs - Class names, objects, or arrays to be combined
 * @returns {string} - Combined class string
 */
export function cn(...inputs) {
  return clsx(inputs);
}
