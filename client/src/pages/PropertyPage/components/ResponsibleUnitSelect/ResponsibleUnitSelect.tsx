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
import { EnhancedSelect } from "../EnhancedSelect";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { SelectNameable } from "../../../HomePage/HomePage";

const GET_ALL_RESPONSIBLE_UNITS_QUERY = `
	query GetAllResponsibleUnits {
		responsibleUnits: getAllUnits {
			name
		}
	} 
`;

const ResponsibleUnitSelect: React.FC<{ readOnly?: boolean }> = ({
  readOnly,
}) => {
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
  return (
    <Controller
      name="responsibleUnit.name"
      control={control}
      defaultValue="undefined"
      render={({ field }) => (
        <SelectNameable
          {...field}
          size="sm"
          readOnly={readOnly}
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
  );
};

export default ResponsibleUnitSelect;
