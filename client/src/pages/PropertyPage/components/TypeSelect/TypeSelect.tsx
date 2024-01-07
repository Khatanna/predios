import { Controller, useFormContext } from "react-hook-form";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
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
import { CustomSelect } from "../CustomSelect";
import { gql } from "@apollo/client";
import { useInputSubscription } from "../../hooks/useInputSubscription";

const GET_ALL_TYPES_QUERY = `
	query GetAllTypes {
		types: getAllTypes {
			name
		}
	}
`;
const GET_ALL_TYPES = gql`
  query GetAllTypes {
    options: getAllTypes {
      name
    }
  }
`;

const TypeSelect: React.FC<{ readOnly?: boolean }> = ({ readOnly }) => {
  const {
    control,
    resetField,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<Property>();
  const { setItems: setTypes, items: types } = useTypeStore();
  const { mutationDelete: mutationTypeDelete } = useTypeMutations<{
    type: Type;
  }>();
  const setModal = useModalStore((s) => s.setModal);
  const type = watch("type.name");
  const { error } = useCustomQuery<{ types: Type[] }>(
    GET_ALL_TYPES_QUERY,
    ["getAllTypes"],
    {
      onSuccess({ types }) {
        setTypes(types);
      },
    },
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
            options={types.map(({ name }) => ({ label: name, value: name }))}
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
              const type = getValues("type");

              if (type) {
                mutationTypeDelete(type, {
                  onSuccess({
                    data: {
                      type: { name },
                    },
                  }) {
                    customSwalSuccess(
                      "Tipo de predio eliminado",
                      `El tipo de predio ${name} se ha eliminado correctamente`,
                    );
                  },
                  onError(error, { name }) {
                    customSwalError(
                      error.response!.data.errors[0].message,
                      `Ocurrio un error al intentar eliminar el tipo de predio ${name}`,
                    );
                  },
                  onSettled() {
                    resetField("type.name", { defaultValue: "undefined" });
                  },
                });
              }
            }}
          />
        )}
      />
    </Form.Group>
  );
};

export default TypeSelect;
