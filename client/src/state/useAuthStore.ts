import { create, StateCreator } from "zustand";
import { UserAuthenticate } from "../types";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import jwtDecode from "jwt-decode";
import { produce } from "immer";
import { User } from "../pages/User/models/types";
import { Permission } from "../pages/PermissionsLayout/types";

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
            role: tokenDecode.role,
            permissions: tokenDecode.permissions.reduce(
              (
                acc: Record<
                  string,
                  Pick<Permission, "resource" | "level" | "status">
                >,
                { resource, level, status },
              ) => {
                const key = resource.concat("@", level);
                acc[key] = {
                  resource,
                  level,
                  status,
                };

                return acc;
              },
              {},
            ),
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
