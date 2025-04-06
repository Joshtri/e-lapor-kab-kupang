// utils/isMobile.js
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android/i.test(window.navigator.userAgent);
};
