import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  OpenModal: () => void;
  closeModal: () => void;
}

const useModal = create<ModalState>((set) => ({
  isOpen: false,
  OpenModal: () => set(() => ({ isOpen: true })),
  closeModal: () => set({ isOpen: false }),
}));

export default useModal;
