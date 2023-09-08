import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { produce } from 'immer';
import { devtools, createJSONStorage, persist } from 'zustand/middleware';
import jwtDecode from "jwt-decode";

interface State {
  refreshToken?: string
  expirationRefreshToken?: number
}

interface Actions {
  setRefreshToken: (token: string) => void;
  deleteRefreshToken: () => void;
}

const initialState: State = {
  refreshToken: undefined,
  expirationRefreshToken: undefined
}

const middlewares = (f: StateCreator<State & Actions, [["zustand/immer", State & Actions]]>) => devtools(persist(immer(f), { name: 'session', storage: createJSONStorage(() => sessionStorage) }));

export const useSessionStore = create(middlewares((set) => ({
  ...initialState,
  setRefreshToken(token) {
    const expirationRefreshToken: { exp: number } = jwtDecode(token);

    set(
      produce((state) => {
        state.refreshToken = token
        state.expirationRefreshToken = expirationRefreshToken.exp;
      })
    )
  },
  deleteRefreshToken() {
    set(initialState)
  },
})))