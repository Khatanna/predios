import { City } from "../../CityPage/models/types"
import { Municipality } from "../../MunicipalityPage/models/types"
import { Property } from "../../PropertyPage/models/types"

export interface Province {
  id: string
  code: string
  name: string
  city: City
  municipalities: Municipality[]
  createdAt: string
  updatedAt: string
  properties: Property[]
}