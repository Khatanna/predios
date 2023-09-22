import { Property } from "../../PropertyPage/models/types"

enum TypeOfObservation {
  STANDART = "STANDARD",
  TECHNICAL = "TECHNICAL",
  LEGAL = "LEGAL"
}

export interface Observation {
  id: string
  observation: string
  type: TypeOfObservation
  property: Property
  createdAt: string
  updatedAt: string
}