import { BaseContext } from "@apollo/server";
import {
  User,
  Permission,
  PrismaClient,
  LevelPermission,
  Resource,
} from "@prisma/client";
import { GraphQLArgs } from "graphql";
import { throwUnAuthenticateError } from "../../utilities";
import { AuthResponses, PermissionErrorMessage } from "../../constants";
import { throwUnauthorizedError } from "../../utilities";
const prisma = new PrismaClient();

const getPermission = (
  permissions: Permission[],
  level: LevelPermission,
  resource: Resource,
) => {
  return permissions.find(
    (permission) =>
      permission.level === level &&
      permission.resource === resource &&
      permission.status === "ENABLE",
  );
};

export const allUsers = async (
  _parent: any,
  _args: GraphQLArgs,
  context: BaseContext & { user?: User & { permissions: Permission[] } },
) => {
  // if (!context.user)
  //   throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);

  // const permission = getPermission(context.user.permissions, "READ", "USER");
  // console.log(permission);
  // if (!permission) {
  //   throw throwUnauthorizedError(PermissionErrorMessage.READ_USER);
  // }

  return prisma.user.findMany({
    where: {
      NOT: {
        // username: context.user.username,
      },
    },
    include: {
      permissions: {
        select: {
          status: true,
          permission: true,
          user: true,
        },
      },
      type: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getUserById = async (_: any, { id }: { id: string }) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { permissions: true },
  });

  return user;
};

export const getUserByUsername = async (
  _: any,
  { username }: { username: string },
) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { permissions: true },
  });

  return user;
};
