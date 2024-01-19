import { create } from "zustand";
import { Resource } from "../pages/UserPage/components/Permission/Permission";

interface State {
  title: string;
  show: boolean;
  value?: string;
  resource: Resource;
  createMutation: (name: string) => void;
  updateMutation: (currentName: string, name: string) => void;
}

interface Actions {
  setModal: (newState: State) => void;
  closeModal: () => void;
}

const initialState: State = {
  title: "",
  show: false,
  createMutation: () => {},
  updateMutation: () => {},
  resource: "RECORD",
};

export const useModalStore = create<State & Actions>()((set) => ({
  ...initialState,
  setModal(newState) {
    set(newState);
  },
  closeModal() {
    set(initialState);
  },
}));
