import { useQuery } from "@tanstack/react-query";
import { useAxios } from ".";
import { GraphQLErrorResponse, GraphQLResponse } from "../types";
import { AxiosError } from "axios";

export const useCustomQuery = <D>(
  query: string,
  queryKey: string[]
) => {
  const axios = useAxios();
  const { data, isLoading, error } = useQuery<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>>({
    queryKey,
    queryFn: async (variables) => {
      const { data } = await axios.post<GraphQLResponse<D>>('/', {
        query,
        variables
      });

      return data;
    }
  });

  return {
    data: data?.data,
    isLoading,
    error: error?.response?.data.errors[0].message
  }
}