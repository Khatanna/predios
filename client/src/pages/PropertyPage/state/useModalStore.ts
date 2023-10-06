import { create } from 'zustand';

interface State {
  showCityCreateModal: boolean;
  showCityUpdateModal: boolean;
  showProvinceCreateModal: boolean;
  showProvinceUpdateModal: boolean;
}

interface Actions {
  setShowCityCreateModal: (value: boolean) => void
  setShowCityUpdateModal: (value: boolean) => void
  setShowProvinceCreateModal: (value: boolean) => void
  setShowProvinceUpdateModal: (value: boolean) => void
}

const initialState: State = {
  showCityCreateModal: false,
  showCityUpdateModal: false,
  showProvinceCreateModal: false,
  showProvinceUpdateModal: false
}

export const useModalStore = create<State & Actions>()((set) => ({
  ...initialState,
  setShowCityCreateModal(value) {
    set({ showCityCreateModal: value })
  },
  setShowCityUpdateModal(value) {
    set({ showCityUpdateModal: value })
  },
  setShowProvinceCreateModal(value) {
    set({ showProvinceCreateModal: value })
  },
  setShowProvinceUpdateModal(value) {
    set({ showProvinceUpdateModal: value })
  },
}))