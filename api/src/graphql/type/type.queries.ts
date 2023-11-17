import { Type } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllTypes = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'TYPE')

    return prisma.type.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getType = (_parent: any, { name }: Pick<Type, 'name'>, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'TYPE')

    return prisma.type.findUniqueOrThrow({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};