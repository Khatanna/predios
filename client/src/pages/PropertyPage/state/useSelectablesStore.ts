import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { City } from "../../CityPage/models/types";
import { Province } from "../../ProvincePage/models/types";
import { Municipality } from "../../MunicipalityPage/models/types";
import { Type } from "../../TypePage/models/types";
import { SubDirectory } from "../../SubDirectoryPage/models/types";
import { Activity } from "../../ActivityPage/models/types";
import { ResponsibleUnit } from "../../ResponsibleUnitPage/models/types";
import { Clasification } from "../../ClasificationPage/models/types";
import { Reference } from "../../ReferencePage/models/types";
import { GroupedState } from "../../GroupedState/models/types";
import { State as StateOfProperty } from "../../StatePage/models/types";

interface State<T extends { name: string }> {
  items: T[];
  previousItems: T[];
}

interface Actions<T extends { name: string }> {
  addItem: (items: T) => void;
  setItems: (items: T[]) => void;
  updateItem: (currentItem: Pick<T, 'name'>, newItem: T) => void;
  deleteItem: (item: Pick<T, 'name'>) => void;
  rollback: () => void;
}

export const createSelectableStore = <T extends { name: string }>() => {
  const initialState: State<T> = {
    items: [],
    previousItems: [],
  };

  return create<State<T> & Actions<T>>()(
    devtools((set) => ({
      ...initialState,
      addItem(item) {
        set((state) => ({ items: [...state.items, item], previousItems: state.items }));
      },
      setItems(items) {
        set({ items, previousItems: items });
      },
      updateItem(currentItem, newItem) {
        set((state) => ({
          previousItems: state.items,
          items: state.items.map((item) => item.name === currentItem.name ? { ...item, name: newItem.name } : item),
        }));
      },
      deleteItem(item) {
        set((state) => ({
          previousItems: state.items,
          items: state.items.filter(({ name }) => name !== item.name),
        }));
      },
      rollback() {
        set(s => ({
          items: s.previousItems,
          previousItems: []
        }))
      },
    })),
  );
};

export const useCityStore = createSelectableStore<Pick<City, 'name'>>();
export const useProvinceStore = createSelectableStore<Pick<Province, 'name'>>();
export const useMunicipalityStore = createSelectableStore<Pick<Municipality, 'name'>>();
export const useTypeStore = createSelectableStore<Pick<Type, 'name'>>();
export const useStateStore = createSelectableStore<Pick<StateOfProperty, 'name'>>();
export const useSubdirectoryStore = createSelectableStore<Pick<SubDirectory, 'name'>>();
export const useActivityStore = createSelectableStore<Pick<Activity, 'name'>>();
export const useResponsibleUnitStore = createSelectableStore<Pick<ResponsibleUnit, 'name'>>();
export const useClasificationStore = createSelectableStore<Pick<Clasification, 'name'>>();
export const useReferenceStore = createSelectableStore<Pick<Reference, 'name'>>();
export const useGroupedStateStore = createSelectableStore<Pick<GroupedState, 'name'>>();