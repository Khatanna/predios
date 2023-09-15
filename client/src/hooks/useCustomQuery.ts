import { useQuery, QueryKey } from "@tanstack/react-query";
import { useStore } from 'zustand';
import { GraphQLErrorResponse, GraphQLResponse } from "../types";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AxiosContext } from "../state/AxiosContext";

export const useCustomQuery = <D, V = unknown>(
  query: string,
  queryKey: QueryKey,
  variables?: V
) => {
  const store = useContext(AxiosContext)
  if (!store) throw new Error("Sin contexto");
  const { axios } = useStore(store);
  const { data, isLoading, error } = useQuery<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>>(queryKey, async () => {
    const { data } = await axios.post<GraphQLResponse<D>>('/', {
      query,
      variables
    });
    console.log(data)
    return data;
  }, {
    retry: 2,
    retryDelay: 200,
  });

  return {
    data: data?.data,
    isLoading,
    error: error?.response?.data.errors[0].message
  }
}