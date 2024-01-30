import { StateCreator } from "zustand";
import { UserAuthenticate } from "../types";
import { immer } from "zustand/middleware/immer";
import {
  Level,
  Resource,
} from "../pages/UserPage/components/Permission/Permission";

interface State {
  isAuth: boolean;
  accessToken?: string;
  user?: UserAuthenticate;
}

interface Actions {
  setAccessToken: (token: string) => void;
  authLogout: () => void;
  setUser: (user: UserAuthenticate) => void;
  can: (permission: `${Level}@${Resource}`) => boolean;
}

export type AuthSlice = State & Actions;

const initialState: State = {
  isAuth: false,
  accessToken: undefined,
  user: undefined,
};

export const authSlice: StateCreator<
  AuthSlice,
  [],
  [["zustand/immer", State]]
> = immer((set, get) => ({
  ...initialState,
  setAccessToken(accessToken) {
    set({
      accessToken,
      isAuth: Boolean(accessToken),
    });
  },
  setUser(user) {
    set({
      user,
      isAuth: true,
    });
  },
  can: (permission) => {
    const user = get().user;
    if (!user) return false;

    return user.role.permissions.some(
      ({ permission: { level, resource } }) =>
        `${level}@${resource}` === permission,
    );
  },
  authLogout() {
    set(initialState);
  },
}));
