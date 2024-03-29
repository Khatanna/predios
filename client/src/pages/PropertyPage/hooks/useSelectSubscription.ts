import { gql, useMutation } from "@apollo/client";
import { Property } from "../models/types";
import { toast } from "sonner";
import { GET_ALL_PROPERTIES_QUERY } from "../components/PropertyList/PropertyList";
import { usePropertyListStore } from "../state/usePropertyListStore";
import { ControllerRenderProps } from "react-hook-form";

const UPDATE_FIELD_MUTATION = gql`
  mutation UpdateField($id: String, $fieldName: String, $value: String) {
    property: updateField(id: $id, fieldName: $fieldName, value: $value) {
      name
    }
  }
`;

type CustomController = {
  name: string;
  ref: (instance: unknown) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement, Element>) => void;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
};

export const useSelectSubscription = (
  id?: string,
): {
  subscribe: (params: CustomController) => CustomController;
} => {
  const { fieldOrder, limit, orderBy, page, unit } = usePropertyListStore();
  const [updateField] = useMutation<
    { property: Property },
    { id: string; fieldName: string; value: string }
  >(UPDATE_FIELD_MUTATION, {
    refetchQueries: [
      {
        query: GET_ALL_PROPERTIES_QUERY,
        variables: {
          page,
          limit,
          orderBy,
          unit,
          fieldOrder,
        },
      },
    ],
  });

  const handleOnChange = (
    { target: { value, name } }: React.ChangeEvent<HTMLSelectElement>,
    id: string,
  ) => {
    // if(disableSubmit) return;
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
  };
  return {
    subscribe: ({ name, onBlur, onChange, ref, value }) => ({
      name,
      onBlur,
      onChange: (e) => {
        onChange(e);

        if (id) {
          if (e?.target?.value) {
            handleOnChange(e, id);
          } else {
            handleOnChange(
              { target: { value: (e as string) ?? "", name } },
              id,
            );
          }
        }
      },
      ref,
      value,
    }),
  };
};
