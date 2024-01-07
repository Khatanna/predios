import { Controller, useFormContext } from "react-hook-form";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { ResponsibleUnit } from "../../../ResponsibleUnitPage/models/types";
import {
  useResponsibleUnitMutations,
  useResponsibleUnitStore,
} from "../../hooks/useRepository";
import { Property } from "../../models/types";
import { useModalStore } from "../../state/useModalStore";

import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { SelectNameable } from "../../../HomePage/HomePage";
import { Form } from "react-bootstrap";
import { CustomLabel } from "../CustomLabel";
import { People } from "react-bootstrap-icons";
import { useInputSubscription } from "../../hooks/useInputSubscription";

const GET_ALL_RESPONSIBLE_UNITS_QUERY = `
	query GetAllResponsibleUnits {
		responsibleUnits: getAllUnits {
			name
		}
	} 
`;

const ResponsibleUnitSelect: React.FC = () => {
  const { control, getValues, watch, resetField } = useFormContext<Property>();
  const { setItems: setResposibleUnits, items: responsibleUnits } =
    useResponsibleUnitStore();
  const setModal = useModalStore((s) => s.setModal);
  const responsibleUnit = watch("responsibleUnit.name");
  const { mutationDelete: mutationResponsibleUnitDelete } =
    useResponsibleUnitMutations<{ unit: ResponsibleUnit }>();

  const { error } = useCustomQuery<{ responsibleUnits: ResponsibleUnit[] }>(
    GET_ALL_RESPONSIBLE_UNITS_QUERY,
    ["getAllResponsibleUnits"],
    {
      onSuccess({ responsibleUnits }) {
        setResposibleUnits(responsibleUnits);
      },
    },
  );
  const { subscribe } = useInputSubscription({
    name: "responsibleUnit.name",
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
  });
  return (
    <Form.Group>
      <CustomLabel
        label="Unidad responsable"
        icon={<People color="#40d781" />}
      />
      <Controller
        name="responsibleUnit.name"
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
            placeholder={"Unidad responsable"}
            options={responsibleUnits.map(({ name }) => ({
              label: name,
              value: name,
            }))}
            onCreate={() => {
              setModal({
                form: "createResponsibleUnit",
                title: "Crear unidad responsable",
                show: true,
              });
            }}
            onEdit={() => {
              setModal({
                form: "updateResponsibleUnit",
                title: "Actualizar unidad responsable",
                show: true,
                params: { name: responsibleUnit },
              });
            }}
            onDelete={() => {
              const responsibleUnit = getValues("responsibleUnit");
              if (responsibleUnit) {
                mutationResponsibleUnitDelete(responsibleUnit, {
                  onSuccess({
                    data: {
                      unit: { name },
                    },
                  }) {
                    customSwalSuccess(
                      "Unidad responsable eliminada",
                      `La unidad responsable ${name} se ha eliminado correctamente`,
                    );
                  },
                  onError(error, { name }) {
                    customSwalError(
                      error.response!.data.errors[0].message,
                      `Ocurrio un error al intentar eliminar la unidad responsable ${name}`,
                    );
                  },
                  onSettled() {
                    resetField("responsibleUnit.name", {
                      defaultValue: "undefined",
                    });
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

export default ResponsibleUnitSelect;
