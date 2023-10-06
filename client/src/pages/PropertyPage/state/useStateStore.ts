import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { State } from '../../StatePage/models/types';

interface StateOfState {
  state?: Pick<State, 'name'>
  states: Pick<State, 'name'>[]
}

interface Actions {
  setState: (state: Pick<State, 'name'>) => void
  addState: (state: Pick<State, 'name'>) => void
  setStates: (states: Pick<State, 'name'>[]) => void
  updateState: (data: { currentName: string, newName: string }) => void
  deleteState: (data: { name: string }) => void
}

const initialState: StateOfState = {
  state: undefined,
  states: []
}

export const useStateStore = create<StateOfState & Actions>()(devtools((set) => ({
  ...initialState,
  setState(state) {
    set({ state })
  },
  addState(state) {
    set(s => ({ states: [...s.states, state] }))
  },
  setStates(states) {
    set({ states })
  },
  updateState({ currentName, newName }) {
    set(s => ({ states: s.states.map(state => state.name === currentName ? { name: newName } : state) }))
  },
  deleteState({ name }) {
    set(s => ({ states: s.states.filter(state => state.name !== name) }));
  },
})))