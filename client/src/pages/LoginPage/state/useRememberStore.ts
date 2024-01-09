import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface State {
  username?: string;
  isRemember: boolean;
}

interface Actions {
  remember: (username: string) => void;
  setRemember: (value: boolean) => void;
}

export const useRememberStore = create<State & Actions>()(
  persist(
    (set) => ({
      isRemember: false,
      remember(username) {
        set({ username, isRemember: true });
      },
      setRemember(isRemember) {
        set((s) => ({
          isRemember,
          username: isRemember ? s.username : undefined,
        }));
      },
    }),
    {
      name: "remember",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
