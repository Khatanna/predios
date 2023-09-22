import { Property } from "../../PropertyPage/models/types"
import { Province } from "../../ProvincePage/models/types"

export interface Municipality {
  id: string
  name: string
  province: Province
  properties: Property[]
  createdAt: string
  updatedAt: string
}