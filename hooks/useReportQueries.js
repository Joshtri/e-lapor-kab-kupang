'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const REPORTS_QUERY_KEY = ['reports'];
const REPORT_DETAIL_KEY = ['report-detail'];

/**
 * Fetch user reports for log laporan page
 * Fetches reports for current logged-in user
 */
const fetchUserReports = async (userId) => {
  const { data } = await axios.get(`/api/reports?userId=${userId}`);
  return data;
};

/**
 * Fetch current user data
 */
const fetchCurrentUser = async () => {
  const { data } = await axios.get('/api/auth/me');
  return data.user;
};

/**
 * Hook to fetch current user with caching
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes cache
    retry: 2,
  });
};

/**
 * Hook to fetch user reports with caching
 * @param {string} userId - The ID of the user
 */
export const useUserReports = (userId) => {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, userId],
    queryFn: () => fetchUserReports(userId),
    enabled: !!userId, // Only fetch if userId is available
    staleTime: 1000 * 60 * 3, // 3 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes cache
    retry: 2,
  });
};

/**
 * Hook to fetch specific report detail
 */
export const useReportDetail = (reportId) => {
  return useQuery({
    queryKey: [...REPORT_DETAIL_KEY, reportId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/reports/${reportId}`);
      return data;
    },
    enabled: !!reportId,
    staleTime: 1000 * 60 * 3, // 3 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes cache
  });
};
