import { Property } from "../../PropertyPage/models/types"
import { State } from "../../StatePage/models/types"
import { User } from "../../UserPage/models/types"

export interface Tracking {
  id: string
  codeOfProperty: string
  property: Property
  state: Pick<State, 'name'>
  dateOfInit: string
  dateOfEnd?: string
  responsible?: Pick<User, 'username' | 'firstLastName' | 'secondLastName' | 'names'>
  observation: string
  numberOfNote: string
}