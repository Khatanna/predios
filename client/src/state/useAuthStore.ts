import { produce } from "immer";
import jwtDecode from "jwt-decode";
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { User } from "../pages/UserPage/models/types";
import { UserAuthenticate } from "../types";

interface State {
  isAuth: boolean;
  accessToken?: string;
  user?: UserAuthenticate;
  expirationAccessToken?: number;
  role?: string;
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
            connection: tokenDecode.connection,
          };

          state.isAuth = true;
          state.expirationAccessToken = tokenDecode.exp;
          state.role = tokenDecode.role.name;
        }),
      );
    },
    reset() {
      set(initialState);
    },
  })),
);
