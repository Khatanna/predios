import { AxiosError, AxiosRequestConfig } from "axios";
import { useStore } from 'zustand'
import { MutateOptions, UseMutateFunction, UseMutationResult, useMutation } from "@tanstack/react-query";
import { GraphQLErrorResponse, GraphQLResponse } from "../types";
import { useContext } from "react";
import { AxiosContext } from "../state/AxiosContext";

export const useCustomMutation = <D, V>(
  query: string,
  handler?: MutateOptions<D, string, V>,
  config?: AxiosRequestConfig
): [
    UseMutateFunction<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>,
    UseMutationResult<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>
  ] => {
  const store = useContext(AxiosContext)
  if (!store) throw new Error("Sin contexto en las peticiones POST");
  const { axios } = useStore(store);

  const mutation = useMutation<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>(
    async (variables) => {
      const { data } = await axios.post<GraphQLResponse<D>>('/', {
        query,
        variables
      }, config)

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
        handler.onError(error.response?.data.errors[0].message ?? error.message, variables, context)
      }
    }
  })

  return [mutation.mutate, mutation]
}