import React, { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastClasses = () => {
    const baseClasses = 'toast fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300';
    const typeClasses = {
      success: 'toast-success bg-green-500 text-white',
      error: 'toast-error bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
    };
    const visibilityClasses = isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full';

    return `${baseClasses} ${typeClasses[type]} ${visibilityClasses}`;
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info', duration?: number) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      message,
      type,
      duration,
      onClose: () => removeToast(id),
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
  };
};

export default Toast;
