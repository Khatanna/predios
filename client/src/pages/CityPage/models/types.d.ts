import { Property } from "../../PropertyPage/models/types"
import { Province } from "../../ProvincePage/models/types"

export interface City {
  id: string
  name: string
  provinces: Province[]
  properties: Property[]
  createdAt: string
  updatedAt: string
}