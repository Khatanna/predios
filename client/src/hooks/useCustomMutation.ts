import { AxiosError, AxiosRequestConfig } from "axios";
import { useAxios } from ".";
import { MutateOptions, UseMutateFunction, useMutation } from "@tanstack/react-query";
import { GraphQLErrorResponse, GraphQLResponse } from "../types";

export const useCustomMutation = <D, V>(
  query: string,
  handler?: MutateOptions<D, string, V>,
  config?: AxiosRequestConfig
): [
    UseMutateFunction<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>,
    { isLoading: boolean, error: AxiosError<GraphQLErrorResponse> | null }
  ] => {
  const axios = useAxios()
  const { mutate, isLoading, error } = useMutation<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>(
    async (variables) => {

      const { data } = await axios.post<GraphQLResponse<D>>('/', {
        query,
        variables
      }, config)
      console.log(data);
      return data;
    }, {
    onSuccess(data, variables, context) {
      console.log(data)
      if (handler && handler.onSuccess) {
        handler.onSuccess(data.data, variables, context);
      }
    },
    onError(error, variables, context) {
      console.log(error)
      if (handler && handler.onError) {
        handler.onError(error.response?.data.errors[0].message ?? 'Ocurrio un error', variables, context)
      }
    }
  })

  return [mutate, { isLoading, error }]
}