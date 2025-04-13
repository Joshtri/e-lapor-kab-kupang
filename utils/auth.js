'use client';

import { getCookie } from 'cookies-next';

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;

  try {
    const cookieToken = getCookie('auth_token');

    if (!cookieToken || cookieToken === 'undefined' || cookieToken === 'null') {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};
