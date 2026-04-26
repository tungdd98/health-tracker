import { create } from 'zustand';

type AppUiState = {
  isShellCompact: boolean;
  toggleShellCompact: () => void;
};

export const useAppUiStore = create<AppUiState>((set) => ({
  isShellCompact: false,
  toggleShellCompact: () =>
    set((state) => ({
      isShellCompact: !state.isShellCompact,
    })),
}));
