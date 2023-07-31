import { PrismaClient } from "@prisma/client";
import { GraphQLArgs } from "graphql";
const prisma = new PrismaClient();

export const allUsers = (_parent: any, _args: GraphQLArgs, _context: any) => {
  return prisma.user.findMany({
    include: {
      permissions: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const findUserById = async (_: any, { id }: { id: string }) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { permissions: true },
  });

  return user;
};
