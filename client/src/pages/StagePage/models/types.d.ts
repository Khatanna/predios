import { State } from "../../StatePage/models/types"

export interface Stage {
  id: string
  name: string
  states: State
  createdAt: string
  updatedAt: string
}