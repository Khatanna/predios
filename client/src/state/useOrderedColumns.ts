import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  columns: string[]
}

interface Actions {
  setOrderedColumns: (newOrder: string[]) => void
}

const initialState: State = {
  columns: ["Nro", "Nombre de usuario", "Nombres", "Apellido Paterno", "Apellido Materno", "Tipo", "Rol", "Estado", "Opciones"]
}

const middlewares = (f: StateCreator<State & Actions, [["zustand/immer", State & Actions]]>) => devtools(persist(immer(f), { name: 'columns', version: 1 }));
export const useOrderedColumns = create(middlewares(
  (set) => ({
    ...initialState,
    setOrderedColumns(newOrder) {
      set({
        columns: newOrder
      })
    },
  })))