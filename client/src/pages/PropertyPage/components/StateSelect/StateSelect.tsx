import { Controller, useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import { useModalStore } from "../../state/useModalStore";
import { useStateMutations, useStateStore } from "../../hooks/useRepository";
import { State } from "../../../StatePage/models/types";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { SelectNameable } from "../../../HomePage/HomePage";
import { Form } from "react-bootstrap";
import { CustomLabel } from "../CustomLabel";
import { DeviceSsd } from "react-bootstrap-icons";
import { useInputSubscription } from "../../hooks/useInputSubscription";

const GET_ALL_STATES_QUERY = `
	query GetAllStates {
		states: getAllStates {
			name
      stage {
        name
      }
		}
	} 
`;

const StateSelect: React.FC<{
  name: "state.name" | `trackings.${number}.state.name`;
}> = ({ name }) => {
  const { control, getValues, watch, resetField } = useFormContext<Property>();
  const setModal = useModalStore((s) => s.setModal);
  const { setItems: setStates, items: states } = useStateStore();
  const { mutationDelete: mutationStateDelete } = useStateMutations<{
    state: State;
  }>();
  const state = watch(name);
  const { subscribe } = useInputSubscription({
    name,
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
  });
  const { error } = useCustomQuery<{ states: State[] }>(
    GET_ALL_STATES_QUERY,
    ["getAllStates"],
    {
      onSuccess({ states }) {
        setStates(states);
      },
    },
  );
  return (
    <Form.Group>
      <CustomLabel label="Estado" icon={<DeviceSsd color="#ff5e00" />} />
      <Controller
        name={name}
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
            highlight
            placeholder={"Estado"}
            options={states.map(({ name }) => ({ label: name, value: name }))}
            onCreate={() => {
              setModal({
                form: "createState",
                title: "Crear Estado",
                show: true,
              });
            }}
            onEdit={() => {
              setModal({
                form: "updateState",
                title: "Actualizar Estado",
                show: true,
                params: { name: state },
              });
            }}
            onDelete={() => {
              const state = getValues("state");
              if (state) {
                mutationStateDelete(state, {
                  onSuccess({
                    data: {
                      state: { name },
                    },
                  }) {
                    customSwalSuccess(
                      "Estado eliminado",
                      `El estado ${name} se ha eliminado correctamente`,
                    );
                  },
                  onError(error, { name }) {
                    customSwalError(
                      error.response!.data.errors[0].message,
                      `Ocurrio un error al intentar eliminar el estado ${name}`,
                    );
                  },
                  onSettled() {
                    resetField(name, { defaultValue: "undefined" });
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

export default StateSelect;
