import { create } from 'zustand';
import { FormKey } from '../components/ModalForm/ModalForm';

interface State {
  form?: FormKey,
  title?: string,
  show: boolean,
  params?: Record<string, string>
}

interface Actions {
  setModal: (newState: State) => void
}

const initialState: State = {
  show: false
}

export const useModalStore = create<State & Actions>()((set) => ({
  ...initialState,
  setModal(newState) {
    set(newState)
  },
}))