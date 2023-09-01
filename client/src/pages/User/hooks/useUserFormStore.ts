import { create } from 'zustand';
import { User } from '../models/types';


interface State {
  user?: User
}

interface Actions {
  setUser: (user: User) => void;
}

const initalState = {
  user: undefined
}

export const useUserFormStore = create<State & Actions>()((set, get) => ({
  ...initalState,
  setUser(user) {
    set({ ...get(), user })
  }
}))