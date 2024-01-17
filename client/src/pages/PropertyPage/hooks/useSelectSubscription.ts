import { gql, useMutation } from "@apollo/client";
import { Property } from "../models/types";
import { toast } from "sonner";

const UPDATE_FIELD_MUTATION = gql`
  mutation UpdateField($id: String, $fieldName: String, $value: String) {
    property: updateField(id: $id, fieldName: $fieldName, value: $value) {
      name
    }
  }
`;

type CustomController = { name: string, ref: any, onBlur: (e: React.FocusEvent<HTMLSelectElement, Element>) => void, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, value: string }

export const useSelectSubscription = (id?: string): { subscribe: (params: CustomController) => CustomController } => {
  const [updateField] = useMutation<
    { property: Property },
    { id: string; fieldName: string; value: string }
  >(
    UPDATE_FIELD_MUTATION,
  );

  const handleOnChange = ({ target: { value, name } }: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    const promise = updateField({
      variables: {
        fieldName: name,
        id,
        value,
      },
    });
    toast.promise(promise, {
      loading: "Actualizando campo",
      success: "Se ha actualizado este campo",
      error: (error) => error.message,
    });
  }

  return {
    subscribe: ({ name, onBlur, onChange, ref, value }) => ({
      name, onBlur, onChange: (e) => {
        onChange(e)
        if (id) {
          handleOnChange(e, id)
        }
      }, ref, value
    })
  }
}