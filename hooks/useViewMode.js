'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for managing ListGrid view mode (table/grid)
 *
 * @param {string} defaultMode - Default view mode ('table' or 'grid'). Default: 'table'
 * @param {string} storageKey - Optional localStorage key for persistence. If provided, view mode will be saved
 * @returns {[string, function]} - [viewMode, setViewMode] tuple, similar to useState
 *
 * @example
 * // Basic usage (no persistence)
 * const [viewMode, setViewMode] = useViewMode();
 *
 * @example
 * // With custom default
 * const [viewMode, setViewMode] = useViewMode('grid');
 *
 * @example
 * // With localStorage persistence
 * const [viewMode, setViewMode] = useViewMode('table', 'admin-list-view');
 */
export function useViewMode(defaultMode = 'table', storageKey = null) {
  // Initialize state from localStorage if key provided, otherwise use default
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window === 'undefined' || !storageKey) {
      return defaultMode;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      return saved || defaultMode;
    } catch (error) {
      console.warn('Failed to read viewMode from localStorage:', error);
      return defaultMode;
    }
  });

  // Save to localStorage when viewMode changes (if key provided)
  useEffect(() => {
    if (typeof window === 'undefined' || !storageKey) {
      return;
    }

    try {
      localStorage.setItem(storageKey, viewMode);
    } catch (error) {
      console.warn('Failed to save viewMode to localStorage:', error);
    }
  }, [viewMode, storageKey]);

  return [viewMode, setViewMode];
}

export default useViewMode;
