import { useQuery } from "@tanstack/react-query";
import { useAxios } from ".";
import { GraphQLErrorResponse, GraphQLResponse } from "../types";
import { AxiosError } from "axios";

export const useCustomQuery = <D, V = unknown>(
  query: string,
  queryKey: string[],
  variables?: V
) => {
  const axios = useAxios();
  const { data, isLoading, error } = useQuery<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>>({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.post<GraphQLResponse<D>>('/', {
        query,
        variables
      });
      console.log(data)
      return data;
    }
  });

  return {
    data: data?.data,
    isLoading,
    error: error?.response?.data.errors[0].message
  }
}