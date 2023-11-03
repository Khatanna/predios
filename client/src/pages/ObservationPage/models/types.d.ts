import { Property } from "../../PropertyPage/models/types";

export interface Observation {
  id: string;
  observation: string;
  type: "STANDARD" | "TECHNICAL";
  property: Property;
  createdAt: string;
  updatedAt: string;
}
