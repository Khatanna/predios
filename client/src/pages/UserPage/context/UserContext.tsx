import { createContext, useRef } from 'react';
import { StoreApi, createStore } from 'zustand';
import { User } from '../models/types';

interface Actions {
  setUsers: (users: Record<string, User>) => void
}

export interface UserContextState extends Actions {
  users: Record<string, User>
}

export const UserContext = createContext<StoreApi<UserContextState> | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef<StoreApi<UserContextState> | null>(null)

  if (!storeRef.current) {
    storeRef.current = createStore<UserContextState>((set) => ({
      users: {},
      setUsers(users) {
        set({ users })
      },
    }))
  }

  return <UserContext.Provider value={storeRef.current}>
    {children}
  </UserContext.Provider>
}


