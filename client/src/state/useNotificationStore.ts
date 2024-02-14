import { FieldPath } from "react-hook-form";
import { Property } from "../pages/PropertyPage/models/types";
import { User } from "../pages/UserPage/models/types";
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

export const fieldNames: Record<
  | FieldPath<Partial<Property>>
  | "trackings.observation"
  | "trackings.responsible"
  | "trackings.numberOfNote"
  | "trackings.dateOfInit"
  | "trackings.state" | string,
  string
> = {
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
  "trackings.observation": "Observación de seguimiento",
  "trackings.responsible": "Responsable de seguimiento",
  "trackings.numberOfNote": "Nota de seguimiento",
  "trackings.dateOfInit": "Fecha de inicio del seguimiento",
  "trackings.state": "Estado de seguimiento",
  "observations": "Observación",
};
