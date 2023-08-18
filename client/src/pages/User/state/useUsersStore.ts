import { create } from "zustand"
import { User } from "../models/types"

interface State {
  // users: Record<string, User>,
  users: User[]
  isLoading: boolean
}

interface Actions {
  setUsers: (users: User[]) => void
  deleteUser: (username: string) => void
}

const initialState = {
  users: [],
  isLoading: false
}

export const useUsersStore = create<State & Actions>()((set, get) => ({
  ...initialState,
  setUsers(users) {
    set({ users })
  },
  deleteUser(username) {
    set({ users: get().users.filter(u => u.username !== username) })
  }
}))