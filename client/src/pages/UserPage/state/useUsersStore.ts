import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
import { User } from '../models/types';

interface State {
  nextCursor?: string;
  prevCursor?: string;
  total: number;
  currentPage: number;
  numberOfResults: number;
  filterText: string;
  usersDeleted: Record<string, User>;
  users: Record<string, User>
  currentCount: number,
}

interface Actions {
  setInitialData: (initialState: Pick<State, 'total'> & { users: User[] }) => void
  getNextPage: (nextPage: { page: number, nextCursor?: string }) => void
  getPreviousPage: (prevPage: { page: number, prevCursor?: string }) => void
  changeRowsPerPage: (numberOfResults: number) => void
  updateUser: ({ username, user }: { username: string, user: Partial<User> }) => void
  deleteUser: (username: string) => void
  rollbackDeleteUser: (username: string) => void
  setFilterText: (filterText: string) => void
}

const initialState: State = {
  total: 0,
  currentPage: 1,
  numberOfResults: 10,
  usersDeleted: {},
  users: {},
  currentCount: 0,
  filterText: ''
}
const middlewares = (
  f: StateCreator<State & Actions, [["zustand/immer", State & Actions]]>,
) => devtools(immer<State & Actions>(f));
export const useUsersStore = create<State & Actions>()(middlewares((set) => ({
  ...initialState,
  setInitialData({ users, total }) {
    const usersMap: Record<string, User> = {};

    users.forEach(user => {
      usersMap[user.username] = user;
    })
    set({
      users: usersMap,
      total
    })
  },
  getNextPage({ page, nextCursor }) {
    set({
      currentPage: page,
      nextCursor,
      prevCursor: undefined,
      users: {}
    })
  },
  getPreviousPage({ page, prevCursor }) {
    set({
      currentPage: page,
      prevCursor,
      nextCursor: undefined,
      users: {}
    })
  },
  changeRowsPerPage(numberOfResults) {
    set(
      produce(draft => {
        draft.numberOfResults = numberOfResults
        draft.prevCursor = undefined
        draft.nextCursor = undefined
        draft.users = {}
      })
    )
  },
  updateUser({ username, user }) {
    set(
      produce((draft) => {
        draft.users[username] = { ...draft.users[username], ...user };
      })
    )
  },
  deleteUser(username) {
    set(
      produce(draft => {
        if (draft.users[username]) {
          draft.usersDeleted[username] = draft.users[username]
          delete draft.users[username]
        }
      })
    )
  },
  rollbackDeleteUser(username) {
    set(
      produce(draft => {
        if (draft.usersDeleted[username]) {
          draft.users[username] = draft.usersDeleted[username]

          const userArray = Object.entries<User>(draft.users);

          console.log(userArray)
          userArray.sort(([, userA], [, userB]) => {
            return userA.id.localeCompare(userB.id);
          });

          const sortedUsers: Record<string, User> = {};
          userArray.forEach(([username, user]) => {
            sortedUsers[username] = user
          });

          draft.users = sortedUsers;
        }
      })
    )
  },
  setFilterText(filterText) {
    set({
      prevCursor: undefined,
      nextCursor: undefined,
      users: {},
      filterText
    })
  },
})))