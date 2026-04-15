import { useState, useCallback, useRef } from 'react';
import type { ToastState } from '../types';

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((state: ToastState) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(state);
    const duration = state.type === 'info' || state.type === 'success' ? 3000 : 5000;
    timerRef.current = setTimeout(() => setToast(null), duration);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
