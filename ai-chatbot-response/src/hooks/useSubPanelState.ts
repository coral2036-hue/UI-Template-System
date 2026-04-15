import { useState, useCallback } from 'react';
import type { SubPanelType } from '../types';

export function useSubPanelState() {
  const [subPanel, setSubPanel] = useState<SubPanelType | null>(null);

  const openPanel = useCallback((panel: SubPanelType) => setSubPanel(panel), []);
  const closePanel = useCallback(() => setSubPanel(null), []);
  const togglePanel = useCallback((panel: SubPanelType) => {
    setSubPanel((prev) => (prev === panel ? null : panel));
  }, []);

  return { subPanel, openPanel, closePanel, togglePanel };
}
