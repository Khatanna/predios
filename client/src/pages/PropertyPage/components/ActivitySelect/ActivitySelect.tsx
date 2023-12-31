import { Controller, useFormContext } from "react-hook-form";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { Activity } from "../../../ActivityPage/models/types";
import { Activity as ActivityIcon } from "react-bootstrap-icons";
import { SelectNameable } from "../../../HomePage/HomePage";
import {
  useActivityMutations,
  useActivityStore,
} from "../../hooks/useRepository";
import { Property } from "../../models/types";
import { useModalStore } from "../../state/useModalStore";
import { Form } from "react-bootstrap";
import { CustomLabel } from "../CustomLabel";
import { useInputSubscription } from "../../hooks/useInputSubscription";

const GET_ALL_ACTIVITIES_QUERY = `
	query GetAllActivities {
		activities: getAllActivities {
			name
		}
	}
`;

const ActivitySelect: React.FC = ({}) => {
  const { control, getValues, watch, resetField } = useFormContext<Property>();
  const setModal = useModalStore((s) => s.setModal);
  const activity = watch("activity.name");
  const { setItems: setActivities, items: activities } = useActivityStore();
  const { mutationDelete: mutationActivityDelete } = useActivityMutations<{
    activity: Activity;
  }>();
  const { error } = useCustomQuery<{ activities: Activity[] }>(
    GET_ALL_ACTIVITIES_QUERY,
    ["getAllActivities"],
    {
      onSuccess({ activities }) {
        setActivities(activities);
      },
    },
  );
  const { subscribe } = useInputSubscription({
    name: "activity.name",
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
  });
  return (
    <Form.Group>
      <CustomLabel label="Actividad" icon={<ActivityIcon color="red" />} />
      <Controller
        name="activity.name"
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
            placeholder={"Actividad"}
            options={activities.map(({ name }) => ({
              label: name,
              value: name,
            }))}
            onCreate={() => {
              setModal({
                form: "createActivity",
                title: "Crear Actividad",
                show: true,
              });
            }}
            onEdit={() => {
              setModal({
                form: "updateActivity",
                title: "Actualizar Actividad",
                show: true,
                params: { name: activity },
              });
            }}
            onDelete={() => {
              const activity = getValues("activity");

              if (activity) {
                mutationActivityDelete(activity, {
                  onSuccess({
                    data: {
                      activity: { name },
                    },
                  }) {
                    customSwalSuccess(
                      "Actividad eliminada",
                      `La actividad ${name} se ha eliminado correctamente`,
                    );
                  },
                  onError(error, { name }) {
                    customSwalError(
                      error.response!.data.errors[0].message,
                      `Ocurrio un error al intentar eliminar la actividad ${name}`,
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

export default ActivitySelect;
