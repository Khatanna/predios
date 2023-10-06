import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
interface State {
  value?: string
}

interface Actions {
  setValue: (value: string | undefined) => void
}

const initialState: State = {
  value: undefined
}

export const useCityFormStore = create<State & Actions>()(devtools((set) => ({
  ...initialState,
  setValue(value) {
    console.log("state", { value })
    set({ value })
  },
})))