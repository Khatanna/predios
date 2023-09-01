import { BaseContext } from "@apollo/server";
import { Prisma, User, Permission, PrismaClient } from "@prisma/client";
import { GraphQLArgs } from "graphql";
import { throwUnAuthenticateError } from "../../utilities";
import { AuthResponses, PermissionErrorMessage } from "../../constants";
import { throwUnauthorizedError } from "../../utilities";
const prisma = new PrismaClient();

export const allUsers = async (
  _parent: any,
  _args: GraphQLArgs,
  context: BaseContext & { user?: User & { permissions: Permission[] } },
) => {
  if (!context.user)
    throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);

  if (!context.user.permissions.some(p => p.level === 'READ') && !context.user.permissions.some(p => p.resource === 'USER')) {
    throw throwUnauthorizedError(PermissionErrorMessage.READ_USER);
  }

  return prisma.user.findMany({
    where: {
      NOT: {
        username: context.user.username
      }
    },
    include: {
      permissions: true,
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
