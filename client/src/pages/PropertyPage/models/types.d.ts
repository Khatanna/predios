import { Activity } from "../../ActivityPage/models/types";
import { Beneficiary } from "../../BeneficiaryPage/models/types";
import { City } from "../../CityPage/models/types";
import { Clasification } from "../../ClasificationPage/models/types";
import { GroupedState } from "../../GroupedState/models/types";
import { Municipality } from "../../MunicipalityPage/models/types";
import { Observation } from "../../ObservationPage/models/types";
import { Province } from "../../ProvincePage/models/types";
import { Reference } from "../../ReferencePage/models/types";
import { ResponsibleUnit } from "../../ResponsibleUnitPage/models/types";
import { State } from "../../StatePage/models/types";
import { SubDirectory } from "../../SubDirectoryPage/models/types";
import { Tracking } from "../../TrackingPage/models/types";
import { Type } from "../../TypePage/models/types";
import { User } from "../../UserPage/models/types";

type UserOnProperty = {
  property: Property;
  user: User;
};

export interface Property {
  id: string;
  registryNumber: number;
  name: string;
  area?: string;
  expertiseOfArea?: string;
  fileNumber: Pick<
    {
      id: string;
      number: string;
    },
    "number"
  >;
  plots: number;
  bodies: number;
  sheets: number;
  code?: string;
  codeOfSearch?: string;
  agrupationIdentifier?: string;
  secondState?: string;
  polygone?: string;
  observations: Pick<Observation, "observation" | "id">[];
  technicalObservation: string;
  beneficiaries: Pick<Beneficiary, "name">[];
  city?: Pick<City, "name">;
  province?: Pick<Province, "name">;
  municipality?: Pick<Municipality, "name">;
  activity?: Pick<Activity, "name">;
  clasification?: Pick<Clasification, "name">;
  state?: Pick<State, "name" | "order" | "stage">;
  groupedState?: Pick<GroupedState, "name">;
  reference?: Pick<Reference, "name">;
  type?: Pick<Type, "name">;
  responsibleUnit?: Pick<ResponsibleUnit, "name">;
  folderLocation?: Pick<SubDirectory, "name">;
  trackings: Pick<
    Tracking,
    | "state"
    | "dateOfInit"
    | "numberOfNote"
    | "observation"
    | "responsible"
    | "id"
  >[];
  technical?: UserOnProperty;
  legal?: UserOnProperty;
  createdAt: string;
  updatedAt: string;
}

export interface FormCreateProps {
  onHide: () => void;
}

export interface FormUpdateProps extends FormCreateProps {
  params?: Record<string, string>;
}

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

export type TUseInputSubscription = {
  onFocus: (e: React.FocusEvent<FormControlElement>) => void;
  onChange: (e: React.ChangeEvent<FormControlElement>) => void;
  onBlur: (e: React.ChangeEvent<FormControlElement>) => void;
};
export type ReturnTUseInputSubscription = {
  isCurrentInput: boolean;
  isSelected: boolean;
  itsMe: boolean;
  isFocused: boolean;
  username: string;
  subscribe: TUseInputSubscription;
  propertyExists: boolean;
  isCurrentContext: boolean;
};

export type TFucused = { contextId: string; isFocused: boolean; name: string };
export type TUseInputSubscriptionParams = {
  name: FieldPath<Property>;
  events?: Partial<TUseInputSubscription>;
  options?: RegisterOptions<Property>;
};
