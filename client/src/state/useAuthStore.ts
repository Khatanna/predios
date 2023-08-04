import { create, StateCreator } from 'zustand';
import { UserAuthenticate } from '../models';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import jwtDecode from 'jwt-decode';

interface State {
  isAuth: boolean;
  accessToken?: string;
  user?: UserAuthenticate;
}

interface Actions {
  setAccessToken: (token: string) => void;
  // getNewAccessToken: (refeshToken: string) => void;
  reset: () => void;
}

const initialState: State = {
  isAuth: false,
  accessToken: undefined,
  user: undefined
}

const middlewares = (f: StateCreator<State & Actions, [["zustand/immer", State & Actions]]>) => devtools(immer(f));

export const useAuthStore = create(middlewares(
  (set, get) => ({
    ...initialState,
    setAccessToken(token) {
      set({
        ...get(),
        accessToken: token,
        user: jwtDecode(token),
        isAuth: true,
      })
    },
    reset() {
      set(initialState)
    },
  })))