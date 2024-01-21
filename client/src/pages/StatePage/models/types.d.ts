import { Property } from "../../PropertyPage/models/types";
import { Stage } from "../../StagePage/models/types";

export interface State {
  id: string;
  name: string;
  properties: Property[];
  createdAt: string;
  updatedAt: string;
  stage: Stage;
}
