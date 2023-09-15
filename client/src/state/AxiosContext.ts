import { createStore } from 'zustand';
import { AxiosInstance } from "axios";
import { createContext } from "react";

interface State {
  axios: AxiosInstance
}

export const createAxiosStore = (axios: AxiosInstance) => createStore<State>()(() => ({
  axios
}))

export const AxiosContext = createContext<ReturnType<typeof createAxiosStore> | null>(null)