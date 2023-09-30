import { useRef, useEffect } from 'react'
import { createStore } from 'zustand';
import { createContext } from "react";
import { useAuth } from '../hooks';
import { Navigate } from 'react-router';

interface State {
  accessToken?: string
}

const createAuthStore = () => createStore<State>()(() => ({
}))

export const AuthContext = createContext<ReturnType<typeof createAuthStore> | null>(null)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<ReturnType<typeof createAuthStore> | null>(null);
  const { accessToken, refreshToken, getNewAccessToken, isAuth } = useAuth();

  useEffect(() => {
    if (!accessToken && refreshToken) {
      getNewAccessToken({ refreshToken })
    }
  }, [accessToken, refreshToken, getNewAccessToken])

  if (!isAuth) {
    return <Navigate to={"/auth"} />;
  }

  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return <AuthContext.Provider value={storeRef.current}>
    {children}
  </AuthContext.Provider>
}
