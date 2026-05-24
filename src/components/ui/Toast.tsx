import { ReactNode } from 'react';

interface ToastProps {
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'error';
}

export function Toast({ children, tone = 'info' }: ToastProps) {
  return (
    <div className={`toast toast--${tone}`} role="status" aria-live="polite">
      {children}
    </div>
  );
}
