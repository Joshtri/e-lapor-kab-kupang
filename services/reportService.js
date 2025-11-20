import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch all reports
 */
export const fetchReports = async () => {
  const { data } = await axios.get('/api/reports');
  return data;
};

/**
 * Fetch report detail by ID
 */
export const fetchReportDetail = async (id) => {
  const { data } = await axios.get(`/api/reports/${id}`);
  return data;
};

/**
 * Create a new report
 */
export const createReport = async (reportData) => {
  const { data } = await axios.post('/api/reports', reportData);
  return data;
};

/**
 * Update a report
 */
export const updateReport = async (id, reportData) => {
  const { data } = await axios.put(`/api/reports/${id}`, reportData);
  return data;
};

/**
 * Delete a report
 */
export const deleteReport = async (id) => {
  await axios.delete(`/api/reports/${id}`);
};

/**
 * Fetch journal reports by date range
 */
export const fetchJournalReports = async (startDate, endDate) => {
  const { data } = await axios.get('/api/reports/jurnal', {
    params: {
      startDate,
      endDate,
    },
  });
  return data;
};

/**
 * Fetch OPD list for filtering
 */
export const fetchOpdList = async () => {
  const { data } = await axios.get('/api/opd');
  return data;
};

/**
 * Fetch user reports for log laporan page
 * @param {string} userId - The user ID
 */
export const fetchUserReports = async (userId) => {
  const { data } = await axios.get(`/api/reports?userId=${userId}`);
  return data;
};

/**
 * Hook to fetch user reports with TanStack Query and caching
 * @param {string} userId - The user ID
 */
export const useUserReports = (userId) => {
  return useQuery({
    queryKey: ['user-reports', userId],
    queryFn: () => fetchUserReports(userId),
    enabled: !!userId, // Only fetch if userId exists
    staleTime: 1000 * 60 * 3, // 3 minutes - data is considered fresh
    gcTime: 1000 * 60 * 15, // 15 minutes - cache time (previously cacheTime in v4)
    retry: 2,
  });
};

/**
 * Hook to fetch specific report detail
 */
export const useReportDetail = (reportId) => {
  return useQuery({
    queryKey: ['report-detail', reportId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/reports/${reportId}`);
      return data;
    },
    enabled: !!reportId,
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
  });
};
