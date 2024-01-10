import { create } from "zustand";

interface State {
  role?: string
}

interface Actions {
  setRole: (state: State) => void
}

export const useRoleStore = create<State & Actions>()((set) => ({
  setRole(state) {
    set(state)
  },
}))