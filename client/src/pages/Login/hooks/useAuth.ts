import { useMutation } from '@tanstack/react-query';
import { UseFormReset } from 'react-hook-form'
import { useAuthStore } from '../state/auth/useAuthStore';
import { AxiosResponseLoginQuery, FormValues } from '../models/types';
import Swal from 'sweetalert2';
import { login } from '../services';

export const useAuth = (variables: FormValues, reset: UseFormReset<FormValues>) => {
  const { loginStore } = useAuthStore(s => s);
  const { isLoading, mutate } = useMutation<AxiosResponseLoginQuery>(() => login(variables), {
    onSuccess({ data, error }) {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: error.message,
          confirmButtonColor: 'green',
          confirmButtonText: 'Aceptar'
        })
        reset({ ...variables, password: '' })
      } else {
        loginStore(data.token)
      }
    },
  });

  return {
    login: mutate,
    isLoading
  }
}