import { Property } from "../../PropertyPage/models/types"

export interface SubDirectory {
  id: string
  name: string
  properties: Property[]
  createdAt: string
  updatedAt: string
}