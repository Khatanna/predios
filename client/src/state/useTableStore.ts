import { createStore } from 'zustand';

interface State {
  dense: boolean
}

interface Actions {
  setDense: (dense: boolean) => void
}

export const createTableStore = (initProps: State) => {
  const DEFAULT_PROPS: State = {
    dense: false
  }

  return createStore<State & Actions>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setDense(dense) {
      console.log({ dense })
      set({
        dense: true
      })
    },
  }))
}
