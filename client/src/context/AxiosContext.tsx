import { AxiosInstance } from "axios";
import { createContext, useRef } from 'react';
import { useAxios } from '../hooks';

export const AxiosContext = createContext<AxiosInstance | null>(null);

export const AxiosProvider = (({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AxiosInstance | null>(null);
  const axios = useAxios();

  if (!storeRef.current) {
    storeRef.current = axios;
  }

  return <AxiosContext.Provider value={storeRef.current}>
    {children}
  </AxiosContext.Provider>;
});
