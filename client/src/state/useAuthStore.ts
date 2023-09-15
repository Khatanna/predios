import { produce } from "immer";
import jwtDecode from "jwt-decode";
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { User } from "../pages/User/models/types";
import { UserAuthenticate } from "../types";

interface State {
  isAuth: boolean;
  accessToken?: string;
  user?: UserAuthenticate;
  expirationAccessToken?: number;
}

interface Actions {
  setAccessToken: (token: string) => void;
  reset: () => void;
}

const initialState: State = {
  isAuth: false,
  accessToken: undefined,
  user: undefined,
  expirationAccessToken: undefined,
};

const middlewares = (
  f: StateCreator<State & Actions, [["zustand/immer", State & Actions]]>,
) => devtools(immer(f));

export const useAuthStore = create(
  middlewares((set) => ({
    ...initialState,
    setAccessToken(token) {
      const tokenDecode: User & { exp: number } = jwtDecode(token)!;

      set(
        produce((state) => {
          state.accessToken = token;
          state.user = {
            username: tokenDecode.username,
          };

          state.isAuth = true;
          state.expirationAccessToken = tokenDecode.exp;
        }),
      );
    },
    reset() {
      set(initialState);
    },
  })),
);
