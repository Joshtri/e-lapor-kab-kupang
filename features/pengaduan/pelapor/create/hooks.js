import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Hook untuk fetch categories
export const useCategories = () => {
  return useSWR('/api/categories?activeOnly=true', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};

// Hook untuk fetch subcategories by category ID
export const useSubcategories = (categoryId) => {
  const shouldFetch = categoryId ? true : false;
  return useSWR(
    shouldFetch ? `/api/subcategories?categoryId=${categoryId}&activeOnly=true` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
};

// Hook untuk fetch OPD list
export const useOpdList = () => {
  return useSWR('/api/opd/list', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};

// Hook untuk create report
export const useCreateReport = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post('/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};

// Hook untuk register push notification
export const useRegisterPushNotification = () => {
  return useMutation({
    mutationFn: async ({ userId, subscription }) => {
      const response = await axios.post('/api/web-push/subscription', {
        subscription,
      });
      return response.data;
    },
  });
};
