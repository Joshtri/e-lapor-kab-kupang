import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Fetch OPDs list
 */
export const useOpdList = () => {
  return useQuery({
    queryKey: ['opd-list'],
    queryFn: async () => {
      const res = await axios.get('/api/opd/list');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Create report mutation
 */
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post('/api/reports', formData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all report-related queries
      queryClient.invalidateQueries({ queryKey: ['user-reports'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
};

/**
 * Register push notification subscription
 */
export const useRegisterPushNotification = () => {
  return useMutation({
    mutationFn: async ({ userId, subscription }) => {
      const response = await axios.post('/api/web-push/subscription', {
        userId,
        subscription,
      });
      return response.data;
    },
    onError: (error) => {
      console.error('Failed to register push notification:', error);
    },
  });
};
