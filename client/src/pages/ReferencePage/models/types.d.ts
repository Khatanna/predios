import { Property } from "../../PropertyPage/models/types"

export interface Reference {
  id: string
  name: string
  properties: Property[]
  createdAt: string
  updatedAt: string
}