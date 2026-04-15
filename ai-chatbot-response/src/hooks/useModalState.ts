import { useState, useCallback } from 'react';
import type { ModalType } from '../types';

export function useModalState() {
  const [modal, setModal] = useState<ModalType | null>(null);

  const openModal = useCallback((type: ModalType) => setModal(type), []);
  const closeModal = useCallback(() => setModal(null), []);

  return { modal, openModal, closeModal };
}
