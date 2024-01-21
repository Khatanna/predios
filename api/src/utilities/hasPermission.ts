import { LevelPermission, Resource } from "@prisma/client";
import { Context } from "../types";
import { AuthResponses, PermissionErrorMessage } from "../constants";
import { throwUnAuthenticateError } from "./throwUnAuthenticateError";

export const hasPermission = (
  user: Context["userContext"],
  level: LevelPermission,
  resource: Resource,
): Error | boolean => {
  if (!user) throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);
  // console.log({ user })
  const permission = user.role.permissions.find(
    ({ permission }) =>
      permission.level === level && permission.resource === resource,
  );

  if (!permission)
    throw new Error(
      PermissionErrorMessage[
        `${level}_${resource}` as keyof typeof PermissionErrorMessage
      ],
    );

  if (permission.permission.status === "DISABLE")
    throw new Error(PermissionErrorMessage.DISABLE_GLOBAL);

  if (permission.status === "DISABLE")
    throw new Error(PermissionErrorMessage.DISABLE_FOR_ROLE);

  return true;
};
