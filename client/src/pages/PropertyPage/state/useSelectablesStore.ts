import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State<T> {
  items: T[];
  previousItems: T[];
}

interface Actions<T> {
  addItem: (items: T) => void;
  setItems: (items: T[]) => void;
  updateItem: (index: number, item: T) => void;
  deleteItem: (index: number) => void;
}

export const createSelectableStore = <T>() => {
  const initialState: State<T> = {
    items: [],
    previousItems: [],
  };

  return create<State<T> & Actions<T>>()(
    devtools((set) => ({
      ...initialState,
      addItem(item) {
        set((s) => ({ items: [...s.items, item], previousItems: s.items }));
      },
      setItems(items) {
        set({ items, previousItems: items });
      },
      updateItem(index, item) {
        set((s) => ({
          items: s.items.splice(index, 1, item),
          previousItems: s.items,
        }));
      },
      deleteItem(index) {
        set((s) => ({
          items: s.items.splice(index, 1),
          previousItems: s.items,
        }));
      },
    })),
  );
};
