import { create } from 'zustand';
import { Property } from '../models/types';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
interface State {
  nextCursor: string,
  prevCursor: string,
  property: Property
}

interface Actions {
  setState: (newState: Partial<State>) => void
}

export const usePaginationStore = create<Partial<State> & Actions>()(devtools((set) => ({
  setState(newState) {
    set(produce(_s => newState));
  },
})));