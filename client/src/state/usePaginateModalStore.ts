import { create } from 'zustand';

interface State {
  page: number;
  limit: number;
}

interface Actions {
  setPage(page: number): void
  setLimit(limit: number): void
}

const initialState: State = {
  page: 1,
  limit: 10
}

export const usePaginateModalStore = create<State & Actions>()((set) => ({
  ...initialState,
  setLimit(limit) {
    set({ limit })
  },
  setPage(page) {
    set({ page })
  },
}))