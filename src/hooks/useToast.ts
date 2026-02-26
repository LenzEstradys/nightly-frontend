import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setToast({ message, type });
  };

  return {
    toast,
    showToast,
    hideToast: () => setToast(null),
  };
}
