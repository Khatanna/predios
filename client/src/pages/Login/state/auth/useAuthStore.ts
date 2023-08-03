import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import jwtDecode from 'jwt-decode';
import { isAuth } from "../../services/isAuth";

interface State {
  isAuth: boolean
  token?: String
  user?: {
    id: string
    username: string
  }
}

interface Actions {
  loginStore: (token: string) => void,
  logoutStore: () => void,
  verifyAuth: () => void
}

const initialState: State = {
  isAuth: false,
  token: undefined,
  user: undefined
}

const middlewares = (f: StateCreator<State & Actions>) => persist(f, { name: 'auth' });

export const useAuthStore = create<State & Actions>()(middlewares((set, get) => ({
  ...initialState,
  loginStore(token) {
    set({ isAuth: true, token, user: jwtDecode(token) })
  },
  logoutStore() {
    set(initialState)
  },
  async verifyAuth() {
    set({ ...get(), isAuth: Boolean(await isAuth(get().user?.id, get().token?.toString())) })
  }
})))