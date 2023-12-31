import { Controller, useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import { useModalStore } from "../../state/useModalStore";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { useClasificationMutations } from "../../hooks/useRepository";
import { Clasification } from "../../../ClasificationPage/models/types";
import { useClasificationStore } from "../../state/useSelectablesStore";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { SelectNameable } from "../../../HomePage/HomePage";
import { Form } from "react-bootstrap";
import { CustomLabel } from "../CustomLabel";
import { Diagram3 } from "react-bootstrap-icons";
import { useInputSubscription } from "../../hooks/useInputSubscription";

const GET_ALL_CLASIFICATIONS_QUERY = `
	query GetAllClasifications {
		clasifications: getAllClasifications {
			name
		}
	}
`;

const ClasificationSelect: React.FC = () => {
  const { control, getValues, watch, resetField } = useFormContext<Property>();
  const { setItems: setClasifications, items: clasifications } =
    useClasificationStore();
  const clasification = watch("clasification.name");
  const { mutationDelete: mutationClasificationDelete } =
    useClasificationMutations<{ clasification: Clasification }>();
  const setModal = useModalStore((s) => s.setModal);
  const { error } = useCustomQuery<{ clasifications: Clasification[] }>(
    GET_ALL_CLASIFICATIONS_QUERY,
    ["getFieldForCreate"],
    {
      onSuccess({ clasifications }) {
        setClasifications(clasifications);
      },
    },
  );
  const { subscribe } = useInputSubscription({
    name: "clasification.name",
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
  });
  return (
    <Form.Group>
      <CustomLabel label="Clasificación" icon={<Diagram3 color="green" />} />
      <Controller
        name="clasification.name"
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
            placeholder={"Clasificación"}
            options={clasifications.map(({ name }) => ({
              label: name,
              value: name,
            }))}
            onCreate={() => {
              setModal({
                form: "createClasification",
                title: "Crear Clasificación",
                show: true,
              });
            }}
            onEdit={() => {
              setModal({
                form: "updateClasification",
                title: "Actualizar Clasificación",
                show: true,
                params: { name: clasification },
              });
            }}
            onDelete={() => {
              const clasification = getValues("clasification");

              if (clasification) {
                mutationClasificationDelete(clasification, {
                  onSuccess({
                    data: {
                      clasification: { name },
                    },
                  }) {
                    customSwalSuccess(
                      "Clasificación eliminada",
                      `La clasificación ${name} se ha eliminado correctamente`,
                    );
                  },
                  onError(error, { name }) {
                    customSwalError(
                      error.response!.data.errors[0].message,
                      `Ocurrio un error al intentar eliminar la clasificación ${name}`,
                    );
                  },
                  onSettled() {
                    resetField("activity.name", { defaultValue: "undefined" });
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

export default ClasificationSelect;
