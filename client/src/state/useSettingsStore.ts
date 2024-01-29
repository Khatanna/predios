import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
interface State {
  sizeOfAvatar: number;
}

interface Actions {
  updateConfig: (config: Partial<State>) => void;
  resetConfig: () => void;
}

const initialState: State = {
  sizeOfAvatar: 50,
};

export const useSettingsStore = create<State & Actions>()(
  immer((set) => ({
    ...initialState,
    updateConfig(config) {
      set(config);
    },
    resetConfig() {
      set(initialState);
    },
  })),
);
