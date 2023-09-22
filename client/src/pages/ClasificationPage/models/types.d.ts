import { Property } from "../../PropertyPage/models/types"

export interface Clasification {
  id: string
  name: string
  properties: Property[]
  createdAt: string
  updatedAt: string
}