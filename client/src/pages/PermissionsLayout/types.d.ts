import { User } from "../User/models/types";

export enum Level {
  DEFAULT = "",
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum Resource {
  DEFAULT = "",
  USER = "USER",
  PERMISSION = "PERMISSION",
}

export type Permission = {
  name: string;
  description: string;
  resource: string;
  level: string;
  users: User[];
  status: string;
  createdAt: Date;
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
