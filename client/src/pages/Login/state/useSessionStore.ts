import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { produce } from 'immer';
import { devtools } from 'zustand/middleware';

interface State {
  refreshToken?: string
}

interface Actions {
  setRefreshToken: (token: string) => void;
  deleteRefreshToken: () => void;
}

const initialState: State = {
  refreshToken: undefined
}

const middlewares = (f: StateCreator<State & Actions, [["zustand/immer", State & Actions]]>) => devtools(persist(immer(f), { name: 'token' }));

export const useSessionStore = create(middlewares((set) => ({
  ...initialState,
  setRefreshToken(token) {
    set(
      produce((state) => {
        state.refreshToken = token
      })
    )
  },
  deleteRefreshToken() {
    set(initialState)
  },
})))