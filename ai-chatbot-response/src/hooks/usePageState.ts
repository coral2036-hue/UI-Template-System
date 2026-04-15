import { useState, useCallback } from 'react';
import type { PageView } from '../types';

export function usePageState() {
  const [currentPage, setCurrentPage] = useState<PageView>('chat');

  const navigateTo = useCallback((page: PageView) => {
    setCurrentPage(page);
  }, []);

  const goBack = useCallback(() => {
    setCurrentPage('chat');
  }, []);

  return { currentPage, navigateTo, goBack };
}
