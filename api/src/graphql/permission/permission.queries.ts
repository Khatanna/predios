import { GraphQLArgs } from "graphql";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllPermissions = async (_parent: any,
  _args: GraphQLArgs,
  { prisma, userContext }: Context,) => {
  try {
    hasPermission(userContext, "READ", "PERMISSION")
    return prisma.permission.findMany({
      where: {
        NOT: {
          resource: 'RECORD'
        }
      }
    });
  } catch (e) {
    throw e;
  }
};

export const getPermissionByName = async (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, "READ", "PERMISSION")
    return prisma.permission.findMany({
      where: { name },
    })
  } catch (e) {
    throw e;
  }
}