import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AxiosContext } from "../context/AxiosContext";
import { GraphQLErrorResponse, GraphQLResponse } from "../types";

export const useCustomQuery = <D>(
  query: string,
  queryKey: QueryKey,
  options?: {
    onSuccess?: (data: D) => void
  } & Omit<UseQueryOptions<D, AxiosError<GraphQLErrorResponse>>, 'queryKey'>
) => {
  const axios = useContext(AxiosContext)
  if (!axios) throw new Error("Sin contexto");

  const { data, error, ...rest } = useQuery<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>>(queryKey, async (variables) => {
    const { data } = await axios.post<GraphQLResponse<D>>('/', {
      query,
      variables: variables.queryKey.length >= 2 ? variables.queryKey.at(-1) : null
    });

    if (options?.onSuccess) {
      options.onSuccess(data.data);
    }
    return data;
  }, {
    retry: 2,
    retryDelay: 200,
    enabled: options?.enabled,
    cacheTime: options?.cacheTime,
    refetchOnWindowFocus() {
      if (options && 'refetchOnWindowFocus' in options) {
        return options.refetchOnWindowFocus as boolean;
      }
      return true;
    },
  });

  return {
    data: data?.data,
    error: error?.response?.data.errors[0].message,
    ...rest
  }
}