import { Role } from "../../types.d.ts"

export type Route = {
  path: string
  name: string,
  children?: Route[]
  role: Role
}