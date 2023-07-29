import { PrismaClient } from "@prisma/client";
import { GraphQLArgs } from "graphql";
const prisma = new PrismaClient();

export const allUsers = async (parent: any, args: GraphQLArgs, context: any) => {
  const result = await prisma.user.findMany({
    include: {
      permissions: true
    },
  });

  // const response = result.map((u) => ({
  //   ...u,
  //   permissions: u.permissions.map((p) => ({ ...p.permission })),
  // }));
  return result;
};

export const findUserById = async (_: any, { id }: { id: string }) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { permissions: true }
  })

  console.log(user);
  // if (user) {
  //   return {
  //     ...user,
  //     permissions: user.permissions.map((p) => ({ ...p.permission })),
  //   };
  // }

  return user;
};
