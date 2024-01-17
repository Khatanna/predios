import { create } from "zustand";
import { produce } from "immer";
import { Property } from "../models/types";
import { devtools } from "zustand/middleware";
interface State {
  property: Property;
  next: string;
  prev: string;
}

interface Actions {
  setState: (newState: Partial<State>) => void;
  reset: () => void;
}

export const usePaginationStore = create<Partial<State> & Actions>()(
  devtools((set) => ({
    setState(newState) {
      set(newState);
    },
    reset() {
      set({
        property: undefined,
        next: undefined,
        prev: undefined,
      });
    },
  })),
);
