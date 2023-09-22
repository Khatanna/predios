import { Property } from "../../PropertyPage/models/types"

export interface Activity {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  properties: Property
}