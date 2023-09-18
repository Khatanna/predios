import { User } from "../../User/models/types"

export interface Record {
  id: string
  result: string
  operation: string
  resource: string
  description: string
  ip: string
  user: User
  action: string
  createdAt: string
  updatedAt: string
}