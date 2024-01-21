import { StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
  refreshToken?: string;
}

interface Actions {
  setRefreshToken: (token: string) => void;
  sessionLogout: () => void;
}

export type SessionSlice = State & Actions;

export const sessionSlice: StateCreator<
  SessionSlice,
  [],
  [["zustand/persist", State]]
> = persist(
  (set) => ({
    setRefreshToken(refreshToken) {
      set({ refreshToken });
    },
    sessionLogout() {
      set({ refreshToken: undefined });
    },
  }),
  {
    name: "session",
    storage: createJSONStorage(() => sessionStorage),
  },
);
