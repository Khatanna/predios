import { Property } from "../../PropertyPage/models/types"

export interface GroupedState {
  id: string
  name: string
  properties: Property[]
  createdAt: string
  updatedAt: string
}