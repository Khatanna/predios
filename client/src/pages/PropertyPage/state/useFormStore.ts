import { create } from 'zustand';
import { UseFormReturn, useForm, FieldValues } from 'react-hook-form';
import { City } from '../../CityPage/models/types';

type State<T extends FieldValues> = UseFormReturn<T>

// export const createHookFormStore = <T extends FieldValues>(form: UseFormReturn<T>) => {
//   return create<State<T>>()(() => form)
// }

export const createFormStore = <T extends FieldValues>() => {

  const useFormStore = () => {
    return useForm<T>();
  }

  return useFormStore
}

export const useCityFormStore = createFormStore<City>();