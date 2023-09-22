import { City } from "../../CityPage/models/types"
import { Property } from "../../PropertyPage/models/types"

export interface Province {
  id: string
  code: string
  name: string
  city: City
  municipalities: []
  createdAt: string
  updatedAt: string
  properties: Property[]
}