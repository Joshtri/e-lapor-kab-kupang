import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

/**
 * Fetch current user data
 */
export const fetchCurrentUser = async () => {
  const { data } = await axios.get('/api/auth/me');
  return data.user;
};

/**
 * Hook to use current user with caching via TanStack Query
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh
    gcTime: 1000 * 60 * 10, // 10 minutes - cache time (previously cacheTime in v4)
    retry: 2,
  });
};

/**
 * Forgot password - send reset link to email
 */
export const forgotPassword = async ({ email }) => {
  const { data } = await axios.post('/api/auth/forgot-password', {
    email,
  });
  return data;
};

/**
 * Hook to forgot password
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

/**
 * Reset password with token
 */
export const resetPassword = async ({ token, newPassword }) => {
  const { data } = await axios.post('/api/auth/reset-password', {
    token,
    newPassword,
  });
  return data;
};

/**
 * Hook to reset password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
