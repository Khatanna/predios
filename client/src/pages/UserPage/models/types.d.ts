import { StateOfStatus } from "../../../utilities/constants";
import { Permission } from "../../PermissionPage/models/types";

export type UserType = {
  id: string;
  name: string;
};

export type RoleHasPermission = {
  status: string;
  permission: Permission;
  assignedBy: string;
};

export type Role = {
  name: string;
  permissions: RoleHasPermission[];
};

export type Status = keyof typeof StateOfStatus;

export type User = {
  names: string;
  firstLastName: string;
  secondLastName: string;
  username: string;
  password: string;
  type: Pick<UserType, "name">;
  status: string;
  createdAt?: string;
  connection: string;
  role: Pick<Role, "name">;
};

export type UserInput = Omit<User, "id" | "createdAt" | "connection">;
export type UserOutput = Omit<User, "id" | "createdAt">;
