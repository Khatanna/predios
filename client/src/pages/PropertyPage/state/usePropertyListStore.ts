import { create } from "zustand";
import { Property } from "../models/types";
import { persist } from "zustand/middleware";

interface State {
  page: number;
  limit: number;
  total: number;
  fieldOrder: keyof Property;
  orderBy: "asc" | "desc";
  unit: string;
}

interface Actions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  setFieldOrder: (fieldOrder: keyof Property, orderBy: "asc" | "desc") => void;
  setUnit: (unit: string) => void;
}

const initialState: State = {
  page: 1,
  limit: 20,
  total: 0,
  fieldOrder: "registryNumber",
  orderBy: "asc",
  unit: "all",
};

export const usePropertyListStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setPage(page) {
        set({ page });
      },
      setLimit(limit) {
        set({ limit });
      },
      setTotal(total) {
        set({ total });
      },
      setFieldOrder(fieldOrder, orderBy) {
        set((state) => ({
          ...state,
          fieldOrder,
          orderBy,
        }));
      },
      setUnit(unit) {
        set({ unit });
      },
    }),
    { name: "propertyList" },
  ),
);
