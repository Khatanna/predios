import { create } from "zustand";
import { AuthSlice, authSlice } from "./authSlice";
import { sessionSlice, SessionSlice } from "./sessionSlice";

interface Actions {
  logout: () => void;
}

export const useAuthStore = create<Actions & SessionSlice & AuthSlice>(
  (set, get, ...a) => ({
    ...sessionSlice(set, get, ...a),
    ...authSlice(set, get, ...a),
    logout() {
      get().authLogout();
      get().sessionLogout();
    },
  }),
);
