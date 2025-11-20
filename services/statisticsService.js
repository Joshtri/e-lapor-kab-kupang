import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch current user data
 */
export const fetchCurrentUser = async () => {
  const { data } = await axios.get('/api/auth/me');
  return data.user;
};

/**
 * Fetch statistics for a user
 */
export const fetchUserStats = async (userId) => {
  const { data } = await axios.get(`/api/reports/stats?userId=${userId}`);
  return data;
};

/**
 * Fetch chart data for a user
 */
export const fetchUserChartData = async (userId, timeRange) => {
  const { data } = await axios.get(
    `/api/reports/stats/chart-data?userId=${userId}&range=${timeRange}`,
  );
  return data;
};

/**
 * Hook to fetch current user with caching
 */
export const useCurrentUserStats = () => {
  return useQuery({
    queryKey: ['current-user-stats'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh
    gcTime: 1000 * 60 * 10, // 10 minutes - cache time
    retry: 2,
  });
};

/**
 * Hook to fetch user statistics with caching
 * @param {string} userId - The user ID
 */
export const useUserStats = (userId) => {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: () => fetchUserStats(userId),
    enabled: !!userId, // Only fetch if userId exists
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch user chart data with caching
 * @param {string} userId - The user ID
 * @param {string} timeRange - The time range (1month, 3months, 6months, 1year)
 */
export const useUserChartData = (userId, timeRange) => {
  return useQuery({
    queryKey: ['user-chart-data', userId, timeRange],
    queryFn: () => fetchUserChartData(userId, timeRange),
    enabled: !!userId, // Only fetch if userId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    retry: 2,
  });
};
