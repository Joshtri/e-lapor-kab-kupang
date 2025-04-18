'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastToggle } from 'flowbite-react';
import {
  HiCheck,
  HiX,
  HiExclamation,
  HiInformationCircle,
} from 'react-icons/hi';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const iconMap = {
  success: {
    icon: HiCheck,
    bg: 'bg-green-100',
    text: 'text-green-500',
    darkBg: 'dark:bg-green-800',
    darkText: 'dark:text-green-200',
  },
  error: {
    icon: HiX,
    bg: 'bg-red-100',
    text: 'text-red-500',
    darkBg: 'dark:bg-red-800',
    darkText: 'dark:text-red-200',
  },
  warning: {
    icon: HiExclamation,
    bg: 'bg-orange-100',
    text: 'text-orange-500',
    darkBg: 'dark:bg-orange-700',
    darkText: 'dark:text-orange-200',
  },
  info: {
    icon: HiInformationCircle,
    bg: 'bg-cyan-100',
    text: 'text-cyan-500',
    darkBg: 'dark:bg-cyan-800',
    darkText: 'dark:text-cyan-200',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, duration = 3000) => {
    const id = Date.now();
    const toast = { id, type, message };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-4">
        {toasts.map(({ id, type, message }) => {
          const Icon = iconMap[type]?.icon || HiInformationCircle;
          const styles = iconMap[type] || iconMap.info;

          return (
            <Toast key={id}>
              <div
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${styles.bg} ${styles.text} ${styles.darkBg} ${styles.darkText}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{message}</div>
              <ToastToggle onDismiss={() => removeToast(id)} />
            </Toast>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
