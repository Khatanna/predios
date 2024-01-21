import { create } from "zustand";
import { Resource } from "../pages/UserPage/components/Permission/Permission";
import { FormNameable } from "../pages/PropertyPage/components/FormNameable";
import { StateFormCreate } from "../pages/PropertyPage/components/StateFormCreate";
import { ProvinceFormCreate } from "../pages/PropertyPage/components/ProvinceFormCreate";
import { MunicipalityFormCreate } from "../pages/PropertyPage/components/MunicipalityFormCreate";
export const forms = {
  nameable: FormNameable,
  state: StateFormCreate,
  province: ProvinceFormCreate,
  municipality: MunicipalityFormCreate,
};
interface State {
  title: string;
  show: boolean;
  value?: string;
  resource: Resource;
  form: keyof typeof forms;
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
  form: "nameable",
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
