import { create } from 'zustand';
import { Property } from '../models/types';
import { persist, createJSONStorage } from 'zustand/middleware'

interface State {
  propertyForm?: Property
}

interface Actions {
  setPropertyForm: (newState: State) => void
}

export const useFormStore = create<State & Actions>()(persist((set) => ({
  setPropertyForm({ propertyForm }) {
    set({ propertyForm });
  },
}), { name: 'form', storage: createJSONStorage(() => localStorage) }))