import { User } from "../User/models/types";

export type Permission = {
  name: string;
  description: string;
  resource: string;
  level: string;
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
  input: Pick<Permission, "name" | "description" | "level" | "resource">;
};

export type UpdatePermissionResponse = {
  data: {
    updated: boolean;
  };
};

export type UpdatePermissionVariables = CreatePermissionVariables;
