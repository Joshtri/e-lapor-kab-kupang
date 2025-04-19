import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Toast, ToastToggle } from 'flowbite-react';
import {
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
  HiInformationCircle,
} from 'react-icons/hi';

// --- Context & Hook ---
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let toastCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration, action }) => {
      const id = ++toastCounter;
      setToasts((prev) => [
        ...prev,
        { id, type, title, message, duration, action },
      ]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // auto-dismiss logic
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration > 0) {
        const timer = setTimeout(() => removeToast(toast.id), toast.duration);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
        {toasts.map(({ id, type, title, message, action }) => (
          <Toast key={id}>
            {/* Icon */}
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
              {
                {
                  success: <HiCheckCircle className="h-5 w-5 text-green-500" />,
                  error: <HiXCircle className="h-5 w-5 text-red-500" />,
                  warning: (
                    <HiExclamationCircle className="h-5 w-5 text-orange-500" />
                  ),
                  info: (
                    <HiInformationCircle className="h-5 w-5 text-blue-500" />
                  ),
                }[type]
              }
            </div>

            {/* Content */}
            <div className="ml-3 text-sm font-normal">
              {title && <div className="font-semibold mb-1">{title}</div>}
              <div>{message}</div>
              {action && <div className="mt-2">{action}</div>}
            </div>

            {/* Dismiss */}
            <ToastToggle onDismiss={() => removeToast(id)} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
