import { Property } from "../../PropertyPage/models/types"

export interface ResponsibleUnit {
  id: string
  name: string
  properties: Property[]
  createdAt: string
  updatedAt: string
}