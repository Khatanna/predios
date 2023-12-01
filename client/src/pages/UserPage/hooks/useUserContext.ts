import { UserContextState, UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useStore } from 'zustand';

export const useUserContext = (selector?: (state: UserContextState) => UserContextState) => {
  const store = useContext(UserContext);
  if (!store) {
    throw new Error("No se encontro el contexto de usuarios")
  }
  return useStore(store, selector ?? ((s) => s));
}