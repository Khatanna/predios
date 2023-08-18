import { create, StateCreator } from 'zustand';
import { UserAuthenticate } from '../models';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import jwtDecode from 'jwt-decode';

interface State {
  isAuth: boolean;
  accessToken?: string;
  user?: UserAuthenticate;
  expirationAccessToken?: number
}

interface Actions {
  setAccessToken: (token: string) => void;
  reset: () => void;
}

const initialState: State = {
  isAuth: false,
  accessToken: undefined,
  user: undefined,
  expirationAccessToken: undefined
}

const middlewares = (f: StateCreator<State & Actions, [["zustand/immer", State & Actions]]>) => devtools(immer(f));

export const useAuthStore = create(middlewares(
  (set, get) => ({
    ...initialState,
    setAccessToken(token) {
      const tokenDecode: UserAuthenticate & { exp: number } = jwtDecode(token)!;

      set({
        ...get(),
        accessToken: token,
        user: tokenDecode,
        isAuth: true,
        expirationAccessToken: tokenDecode.exp
      })
    },
    reset() {
      set(initialState)
    },
  })))