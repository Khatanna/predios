import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware'

interface TableState {
  name: string;
  dense: boolean
}

interface State {
  tables: TableState[]
}

interface Actions {
  // setDense: (dense: boolean) => void
}

const initialState: State = {
  tables: []
}

const middlewares = (f: StateCreator<State & Actions>) => persist(f, { name: 'tables' });

export const useTableStore = create<State & Actions>()(middlewares(() => ({
  ...initialState,
  // setDense(id, dense) {
  //   set({

  //   })
  // },
})))