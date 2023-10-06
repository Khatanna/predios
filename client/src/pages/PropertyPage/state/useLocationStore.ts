import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { City } from '../../CityPage/models/types';
import { Province } from '../../ProvincePage/models/types';
import { Municipality } from '../../MunicipalityPage/models/types';

interface State {
  city?: Pick<City, 'name'>
  province?: Pick<Province, 'name'>
  municipality?: Pick<Municipality, 'name'>
  cities: Pick<City, 'name'>[],
  previousCities: Pick<City, 'name'>[]
  previousProvinces: Pick<City, 'name'>[]
  provinces: Pick<Province, 'name'>[]
  municipalities: Pick<Municipality, 'name'>[]
  previousMunicipalities: Pick<City, 'name'>[]
}

interface Actions {
  setCity: (city: Pick<City, 'name'>) => void
  setProvince: (province: Pick<Province, 'name'>) => void
  setMunicipality: (municipality: Pick<Municipality, 'name'>) => void
  setCities: (cities: Pick<City, 'name'>[]) => void
  setProvinces: (provinces: Pick<Province, 'name'>[]) => void
  setMunicipalities: (municipalities: Pick<Municipality, 'name'>[]) => void
  addCity: (city: Pick<City, 'name'>) => void
  addProvince: (province: Pick<Province, 'name'>) => void
  addMunicipality: (municipality: Pick<Municipality, 'name'>) => void
  deleteCity: (city: Pick<City, 'name'>) => void
  deleteProvince: (province: Pick<Province, 'name'>) => void
  deleteMunicipality: (municipality: Pick<Municipality, 'name'>) => void
  updateCity: (args: { currentName: string, newName: string }) => void
  updateProvince: (args: { currentName: string, newName: string }) => void
  updateMunicipality: (args: { currentName: string, newName: string }) => void
  rollbackCities: () => void
  rollbackProvinces: () => void
  rollbackMunicipalities: () => void
}

const initialState: State = {
  cities: [],
  provinces: [],
  municipalities: [],
  previousCities: [],
  previousProvinces: [],
  previousMunicipalities: [],
  city: undefined,
  province: undefined,
  municipality: undefined,
}

const middlewares = (f: StateCreator<State & Actions>) => devtools(f);

export const useLocationStore = create<State & Actions>()(middlewares((set, get) => ({
  ...initialState,
  setCities(cities) {
    set({ cities, previousCities: cities })
  },
  setProvinces(provinces) {
    set({ provinces, previousProvinces: provinces })
  },
  setMunicipalities(municipalities) {
    set({ municipalities, previousMunicipalities: municipalities })
  },
  setCity(city) {
    set({ city, province: undefined, municipality: undefined })
  },
  setProvince(province) {
    set({ province })
  },
  setMunicipality(municipality) {
    set({ municipality })
  },
  addProvince(province) {
    set(s => ({ provinces: [...s.provinces, province], previousProvinces: s.provinces }))
  },
  addCity(city) {
    set((s) => ({ cities: [...s.cities, city], previousCities: s.cities }))
  },
  addMunicipality(municipality) {
    set(s => ({ municipalities: [...s.municipalities, municipality], previousMunicipalities: s.municipalities }))
  },
  deleteCity({ name }) {
    set(s => ({ previousCities: s.cities, cities: s.cities.filter(city => city.name !== name), city: undefined, provinces: [], province: undefined }))
  },
  rollbackCities() {
    set(s => ({
      cities: s.previousCities,
      previousCities: []
    }))
  },
  rollbackProvinces() {
    set(s => ({
      provinces: s.previousProvinces,
      previousProvinces: []
    }))
  },
  rollbackMunicipalities() {
    set(s => ({
      municipalities: s.previousMunicipalities,
      previousMunicipalities: []
    }))
  },
  deleteProvince({ name }) {
    set(s => ({ previousProvinces: s.provinces, provinces: s.provinces.filter(province => province.name !== name), province: undefined }))
  },
  deleteMunicipality({ name }) {
    set(s => ({ previousMunicipalities: s.municipalities, municipalities: s.municipalities.filter(municipality => municipality.name !== name) }))
  },
  updateCity({ currentName, newName }) {
    set({ city: undefined, cities: get().cities.map(city => city.name === currentName ? { name: newName } : city) })
  },
  updateProvince({ currentName, newName }) {
    set({ province: undefined, provinces: get().provinces.map(province => province.name === currentName ? { name: newName } : province) })
  },
  updateMunicipality({ currentName, newName }) {
    set({ municipality: undefined, municipalities: get().municipalities.map(municipality => municipality.name === currentName ? { name: newName } : municipality) })
  },
})));
