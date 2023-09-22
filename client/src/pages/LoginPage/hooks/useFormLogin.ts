import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormLoginValues } from '../models/types';

const schema = yup.object({
  username: yup.string()
    .required('El nombre de usuario es un campo obligatorio'),
  password: yup.string()
    .required('La contraseña es un campo obligatorio')
    .min(8, 'La contraseña debe tener almenos 8 caracteres')
    .max(32, 'La contraseña no debe tener mas de 32 caracteres')
})

export const useFormLogin = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormLoginValues>({
    resolver: yupResolver(schema), defaultValues: { username: '', password: '' }
  });

  return {
    register,
    handleSubmit,
    errors,
    getValues
  }
}