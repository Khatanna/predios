import { useMutation } from '@tanstack/react-query';
import { AxiosResponseLoginQuery, FormLoginValues } from "../models/types";
import { login } from "../services";
import Swal from 'sweetalert2';
import { useSessionStore } from '../state';
import { useAuthStore } from '../../../state/useAuthStore';

export const useLogin = (variables: FormLoginValues) => {
  const { setRefreshToken } = useSessionStore();
  const { setAccessToken } = useAuthStore();
  const { isLoading, mutate } = useMutation<AxiosResponseLoginQuery>(() => login(variables), {
    onSuccess({ data, error }) {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Intento de sesión fallido',
          text: error.message,
          confirmButtonColor: 'green',
          confirmButtonText: 'Aceptar'
        })
      } else {
        setRefreshToken(data.auth.refreshToken);
        setAccessToken(data.auth.accessToken);
      }
    },
  });

  return {
    isLoading,
    login: mutate
  }
}