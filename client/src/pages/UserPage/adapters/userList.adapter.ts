import { User } from "../models/types"

export const userListAdapter = (users?: User[]): User[] => {
  if (!users) {
    return []
  }

  return users
}