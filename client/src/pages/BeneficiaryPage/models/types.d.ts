import { Property } from "../../PropertyPage/models/types"

export interface Beneficiary {
  id: string
  name: string
  properties: Property
  createdAt: string
  updatedAt: string
}