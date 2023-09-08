import { Permission } from "./pages/PermissionsLayout/types";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

export type UserAuthenticate = {
  username: string;
  permissions: Record<string, Pick<Permission, 'resource' | 'level'>>
  role: Role
}

export type GraphQLResponse<T> = {
  data: T
}

export type GraphQLErrorResponse = {
  errors: Error[]
}