import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 5000, onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: { bg: '#10b981', icon: '✅' },
    error: { bg: '#ef4444', icon: '❌' },
    warning: { bg: '#f59e0b', icon: '⚠️' },
    info: { bg: '#3b82f6', icon: 'ℹ️' },
  };

  const { bg, icon } = colors[type];

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        background: bg,
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: 10000,
        maxWidth: '400px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.25rem',
          cursor: 'pointer',
          padding: '0',
          opacity: 0.7,
        }}
      >
        ×
      </button>
    </div>
  );
}

