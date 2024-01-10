import { Level, Resource } from "../../UserPage/components/Permission/Permission";
import { User } from "../User/models/types";

export type Permission = {
  id: string;
  name: string;
  description: string;
  resource: Resource;
  level: Level;
  users: User[];
  status: string;
  createdAt: string;
  updatedAt: Date;
};

export type CreatePermissionResponse = {
  data: {
    created: boolean;
  };
};

export type CreatePermissionVariables = {
  input: Pick<Permission, "name" | "description" | "level" | "resource" | 'status'>;
};

export type UpdatePermissionResponse = {
  data: {
    updated: boolean;
  };
};

export type UpdatePermissionVariables = CreatePermissionVariables;
