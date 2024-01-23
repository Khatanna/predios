import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { User } from "../pages/UserPage/models/types";
import { Property } from "../pages/PropertyPage/models/types";
import { FieldPath } from "react-hook-form";
export type Notification = {
  id: string;
  title: string;
  from: User;
  to: User;
  property: Property;
  fieldName: string;
  read: boolean;
  timeAgo: string;
};

interface State {
  notifications: Notification[];
  unreadNotifications: number;
}

interface Actions {
  addNotification: (
    notification: Omit<
      Notification,
      "id" | "timeAgo" | "timestamp" | "fieldName"
    > & { fieldName: FieldPath<Property> },
  ) => void;
  toggleReadNotification: (notification: Pick<Notification, "id">) => void;
  removeNotification: (notification: Pick<Notification, "id">) => void;
}

const initialState: State = {
  notifications: [],
  unreadNotifications: 0,
};

export const fieldNames: Record<FieldPath<Partial<Property>>, string> = {
  registryNumber: "Numero de registro",
  name: "Nombre de predio",
  polygone: "Poligono",
  code: "Codigo",
  "activity.name": "Actividad",
  codeOfSearch: "Codigo de busqueda",
  "city.name": "Departamento",
  "clasification.name": "Clasificación",
  "fileNumber.number": "Nro. de expediente",
  "folderLocation.name": "Ubicación de carperta",
  "groupedState.name": "Estado agrupado",
  "municipality.name": "Municipio",
  "province.name": "Provincia",
  "reference.name": "Referencia",
  "state.name": "Estado",
  agrupationIdentifier: "Id de agrupación social",
  area: "Superficie",
  expertiseOfArea: "Superficie de pericia",
  bodies: "Cuerpos",
  sheets: "Fojas",
  plots: "Parcelas",
  "type.name": "Tipo de predio",
  "responsibleUnit.name": "Unidad responsable",
  technicalObservation: "Observación tecnica",
  secondState: "Estado 2",
  "technical.user.username": "Tecnico",
  "legal.user.username": "Juridico",
};

export const useNotificationsStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      ...initialState,
      addNotification(notification) {
        set((state) => {
          state.notifications.push({
            id: crypto.randomUUID(),
            timeAgo: `${new Date().getTime()}`,
            ...notification,
            fieldName: fieldNames[notification.fieldName],
          });

          state.unreadNotifications++;
        });
      },
      toggleReadNotification({ id }) {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);

          if (notification) {
            notification.read = !notification.read;
            state.unreadNotifications += !notification.read ? 1 : -1;
          }
        });
      },
      removeNotification({ id }) {
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
          state.unreadNotifications = state.notifications.filter(
            (n) => !n.read,
          ).length;
        });
      },
    })),
    { name: "notifications" },
  ),
);
