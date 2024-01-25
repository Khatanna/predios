import { Property } from "../../PropertyPage/models/types";
import { State } from "../../StatePage/models/types";
import { User } from "../../UserPage/models/types";

export interface Tracking {
  id?: string;
  property: Property;
  state: Pick<State, "name">;
  dateOfInit: string;
  responsible?: Pick<
    User,
    "username" | "firstLastName" | "secondLastName" | "names"
  >;
  observation: string;
  numberOfNote: string;
}
