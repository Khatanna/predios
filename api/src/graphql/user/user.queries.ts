import { BaseContext } from "@apollo/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { GraphQLArgs } from "graphql";
import { throwUnAuthenticateError } from "../../utilities";
import { AuthResponses } from "../../constants";
const prisma = new PrismaClient();

export const allUsers = (_parent: any, _args: GraphQLArgs, context: BaseContext & { user?: Prisma.UserCreateInput }) => {
  if (!context.user) throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);

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

export const getUserByUsername = async (_: any, { username }: { username: string }) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { permissions: true },
  });

  return user;
};

