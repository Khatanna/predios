import { AxiosError, AxiosRequestConfig } from "axios";
import { MutationOptions, UseMutateFunction, UseMutationResult, useMutation } from "@tanstack/react-query";
import { GraphQLErrorResponse, GraphQLResponse } from "../types";
import { useContext } from "react";
import { AxiosContext } from "../context/AxiosContext";

export const useCustomMutation = <D, V>(
  query: string,
  handler?: MutationOptions<D, string, V, unknown>,
  config?: AxiosRequestConfig,
): [
    UseMutateFunction<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>,
    UseMutationResult<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>
  ] => {
  const axios = useContext(AxiosContext)
  if (!axios) throw new Error("Sin contexto en las peticiones POST");

  const mutation = useMutation<GraphQLResponse<D>, AxiosError<GraphQLErrorResponse>, V>(
    async (variables) => {
      const { data } = await axios.post<GraphQLResponse<D>>('/', {
        query: query,
        variables
      }, config)

      return data;
    },
    {
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
      },
      onMutate(variables) {
        if (handler && handler.onMutate) {
          handler.onMutate(variables)
        }
      },
    })

  return [mutation.mutate, mutation]
}