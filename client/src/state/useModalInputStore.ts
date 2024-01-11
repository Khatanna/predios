import { create } from "zustand";

interface State {
  isOpen: boolean
  fieldName: string
}

interface Actions {
  openModal: () => void
  closeModal: () => void
  setFieldName: (state: Pick<State, 'fieldName'>) => void
}

export const useModalInputStore = create<State & Actions>()((set) => ({
  isOpen: false,
  fieldName: '',
  openModal() {
    set({ isOpen: true })
  },
  closeModal() {
    set({ isOpen: false })
  },
  setFieldName(state) {
    set(state)
  },
}))