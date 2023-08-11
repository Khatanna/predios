import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import type { APILoginResponse, FormLoginValues, GraphQLErrorResponse, GraphQLResponse } from "../models/types";
import { login } from "../services";
import { useAuth } from '../../../hooks';

export const useFetchLogin = () => {
  const { setRefreshToken, setAccessToken } = useAuth()
  const { isLoading, mutate } = useMutation<AxiosResponse<GraphQLResponse<APILoginResponse>>, AxiosError<GraphQLErrorResponse>, FormLoginValues>(login, {
    onSuccess({ data: { data: { auth: { accessToken, refreshToken } } } }) {
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
    },
    onError({ response }) {
      Swal.fire({
        icon: 'error',
        title: 'Intento de sesión fallido',
        text: response?.data.errors[0].message,
        confirmButtonColor: 'green',
        confirmButtonText: 'Aceptar'
      })
    }
  });

  return {
    isLoading,
    login: mutate
  }
}