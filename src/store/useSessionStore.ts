import { create } from "zustand";

interface ISessionStore {
  counter: number;
  isModalOpen: boolean;
  incrementCounter: () => void;
  resetCounter: () => void;
  openModal: () => void;
  closeModal: () => void;
  handleSessionClose: () => void;
}

export const useSessionStore = create<ISessionStore>(set => ({
  counter: 0,
  isModalOpen: false,
  incrementCounter: () => set(state => ({ counter: state.counter + 1 })),
  resetCounter: () => set(() => ({ counter: 0 })),
  openModal: () => set(() => ({ isModalOpen: true })),
  closeModal: () => set(() => ({ isModalOpen: false })),
  handleSessionClose: () => {
    window.location.href = "../mifin/userAuthAction.do?dispatchMethod=logout";
  },
}));
