import { Controller, useFormContext } from "react-hook-form";
import { Type } from "../../../TypePage/models/types";
import { useTypeMutations, useTypeStore } from "../../hooks/useRepository";
import { Property } from "../../models/types";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { useModalStore } from "../../state/useModalStore";
import { SelectNameable } from "../../../HomePage/HomePage";
import { Form } from "react-bootstrap";
import { CustomLabel } from "../CustomLabel";
import { ListColumns } from "react-bootstrap-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useInputSubscription } from "../../hooks/useInputSubscription";
import { toast } from "sonner";

const GET_ALL_TYPES_QUERY = gql`
  query GetAllTypes {
    types: getAllTypes {
      name
    }
  }
`;

const CREATE_TYPE_MUTATION = gql`
	mutation CreateType($input: TypeInput) {
		type: createType(input: $input) {
			name
		}
	}
`;

const UPDATE_TYPE_MUTATION = gql`
	mutation UpdateType($name: String, $item: TypeInput) {
		type: updateType(name: $name, item: $item) {
			name
		}
	}
`;

const DELETE_TYPE_MUTATION = gql`
  mutation DeleteType($name: String) {
    type: deleteType(name: $name) {
      name
    }
  }
`

const TypeSelect: React.FC = () => {
  const {
    control,
    resetField,
    getValues,
    watch,
  } = useFormContext<Property>();
  const [deleteType] = useMutation<{ type: Pick<Type, 'name'> }, { name: string }>(DELETE_TYPE_MUTATION, {
    optimisticResponse: ({ name }) => ({
      type: { name }
    }),
    update: (cache, { data }) => {
      if (!data) return;

      const query = cache.readQuery(
        { query: GET_ALL_TYPES_QUERY, }
      ) as { types: Type[] };

      if (!query) return;

      cache.writeQuery({
        query: GET_ALL_TYPES_QUERY,
        data: {
          types: query.types.filter(type => type.name !== data.type.name)
        }
      })
    },
    // refetchQueries: [GET_ALL_TYPES_QUERY]
  })
  const setModal = useModalStore((s) => s.setModal);
  const type = watch("type.name");
  const { data } = useQuery<{ types: Type[] }>(
    GET_ALL_TYPES_QUERY
  );
  const { subscribe } = useInputSubscription({
    name: "type.name",
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
  });
  return (
    <Form.Group>
      <CustomLabel label="Tipo de predio" icon={<ListColumns />} />
      <Controller
        name="type.name"
        control={control}
        defaultValue="undefined"
        render={({ field }) => (
          <SelectNameable
            {...field}
            {...subscribe}
            onChange={(e) => {
              field.onChange(e);
              subscribe.onChange(e);
            }}
            size="sm"
            placeholder={"Tipo de predio"}
            options={data?.types.map(({ name }) => ({ label: name, value: name })) ?? []}
            onCreate={() => {
              setModal({
                form: "createType",
                title: "Crear tipo de predio",
                show: true,
              });
            }}
            onEdit={() => {
              setModal({
                form: "updateType",
                title: "Actualizar tipo de predio",
                show: true,
                params: { name: type },
              });
            }}
            onDelete={() => {
              const name = getValues("type.name");

              if (type) {
                toast.promise(
                  deleteType({
                    variables: {
                      name
                    }
                  }), {
                  loading: 'Eliminando',
                  success: 'Tipo de predio eliminado',
                  error: 'No se pudo eliminar, intente mas tarde',
                  finally() {
                    resetField("type.name", { defaultValue: "undefined" });
                  },
                }
                )
              }
            }}
          />
        )}
      />
    </Form.Group>
  );
};

export default TypeSelect;
